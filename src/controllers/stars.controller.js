const { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const s3Client = require("../config/awsConfig");
const path = require("path");

const {
  getFilteredStarRegionsService,
  setStarsNameService,
  getStarsRankingService,
  voteForStarService,
  checkIfUserVotedService,
  checkStarRankingApplicationService,
} = require("../services/stars.service.js");
const {
  extractUserIdFromToken,
  validateUserId,
} = require("../dtos/stars.dto.js");

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

// Multer 설정 (메모리 저장)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const getFilteredStarRegions = async (req, res) => {
  try {
    // 요청에서 `stars_id` 가져오기
    const { stars_id } = req.params;

    if (!stars_id || isNaN(stars_id)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "유효한 stars_id가 필요합니다." });
    }

    // 서비스 호출 (user_id 대신 stars_id로 조회)
    const regions = await getFilteredStarRegionsService(parseInt(stars_id, 10));

    res.status(StatusCodes.OK).json({ regions });
  } catch (error) {
    console.error("별자리 지역 조회 오류:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "서버 오류가 발생했습니다.",
      error: error.message,
    });
  }
};
const setStarsNameWithImage = async (req, res) => {
  try {
    console.log("별자리 이름 설정 + 이미지 업로드 요청 도착!");
    console.log("Received body:", req.body);
    const AWS_REGION = process.env.AWS_REGION || "ap-northeast-2"; // 기본값 설정
    console.log("AWS_REGION:", AWS_REGION);

    const userId = extractUserIdFromToken(req);
    if (!userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "로그인이 필요합니다." });
    }

    const { name } = req.body;
    if (!name) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "별자리 이름이 필요합니다." });
    }

    let uploadPromise = Promise.resolve(null); // 기본값 (파일이 없을 때)

    // 🌟 이미지 업로드를 비동기 처리
    if (req.file) {
      const fileName = `stars/${userId}.png`;
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: "public-read",
      };

      uploadPromise = s3Client.send(new PutObjectCommand(uploadParams)); // S3 업로드 실행
    }

    // 🌟 DB 업데이트를 비동기 처리
    const dbUpdatePromise = setStarsNameService(userId, name);

    // 🌟 S3 업로드와 DB 업데이트를 병렬 처리 (속도 개선!)
    await Promise.all([uploadPromise, dbUpdatePromise]);

    // S3 URL 생성
    const fileUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/stars/${userId}.png`;

    res.status(StatusCodes.OK).json({
      message: "별자리 이름 및 이미지 설정 성공",
      stars: await dbUpdatePromise, // 업데이트된 DB 정보 반환
      imageUrl: req.file ? fileUrl : null, // 이미지가 있으면 URL 반환
    });
  } catch (error) {
    console.error("별자리 이름 및 이미지 설정 오류:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "서버 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

const getStarsRanking = async (req, res) => {
  try {
    console.log("별자리 랭킹 조회 요청 도착!");

    const rankings = await getStarsRankingService();

    res.status(StatusCodes.OK).json({
      message: "별자리 랭킹 조회 성공",
      rankings,
    });
  } catch (error) {
    console.error("별자리 랭킹 조회 오류:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "서버 오류가 발생했습니다.",
      error: error.message,
    });
  }
};
const voteForStar = async (req, res) => {
  try {
    const tokenUserId = extractUserIdFromToken(req); // 인증 토큰에서 사용자 ID 추출
    const { stars_id, post_user_id } = req.body; // stars_id와 게시글 작성자 ID(post_user_id) 추출

    if (!tokenUserId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "로그인이 필요합니다." });
    }

    if (!stars_id || isNaN(stars_id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "유효한 stars_id가 필요합니다.",
      });
    }

    if (!post_user_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "post_user_id가 필요합니다.",
      });
    }

    // 투표 서비스 호출
    const updatedStar = await voteForStarService(
      tokenUserId,
      parseInt(stars_id, 10),
      post_user_id
    );

    res.status(StatusCodes.OK).json({
      message: "별자리 투표 성공",
      star: updatedStar,
    });
  } catch (error) {
    if (error.message === "자신의 별자리에 투표할 수 없습니다.") {
      return res.status(StatusCodes.FORBIDDEN).json({ message: error.message });
    }

    if (error.message === "이미 이 별자리에 투표하셨습니다.") {
      return res.status(StatusCodes.CONFLICT).json({ message: error.message });
    }

    console.error("별자리 투표 오류:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "서버 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

const checkIfUserVoted = async (req, res) => {
  try {
    const userId = extractUserIdFromToken(req); // 토큰에서 사용자 ID 추출
    if (!userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "로그인이 필요합니다." });
    }

    const { stars_id } = req.params;
    if (!stars_id || isNaN(stars_id)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "유효한 stars_id가 필요합니다." });
    }

    // 투표 여부 확인 서비스 호출
    const hasVoted = await checkIfUserVotedService(
      userId,
      parseInt(stars_id, 10)
    );

    res.status(StatusCodes.OK).json({ voted: hasVoted });
  } catch (error) {
    console.error("투표 여부 확인 오류:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "서버 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

const checkStarRanking = async (req, res) => {
  try {
    const userId = extractUserIdFromToken(req); // 토큰에서 사용자 ID 추출
    if (!userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "로그인이 필요합니다." });
    }

    // 서비스 호출
    const hasApplied = await checkStarRankingApplicationService(userId);

    res.status(StatusCodes.OK).json({ applied: hasApplied });
  } catch (error) {
    console.error("별자리 랭킹 신청 여부 확인 오류:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "서버 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

module.exports = {
  upload,
  getFilteredStarRegions,
  setStarsNameWithImage,
  getStarsRanking,
  voteForStar,
  checkIfUserVoted,
  checkStarRanking,
};
