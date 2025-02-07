const { StatusCodes } = require("http-status-codes");
const {
  getFilteredStarRegionsService,
  setStarsNameService,
  getStarsRankingService,
  voteForStarService,
} = require("../services/stars.service.js");
const {
  extractUserIdFromToken,
  validateUserId,
} = require("../dtos/stars.dto.js");

const getFilteredStarRegions = async (req, res) => {
  try {
    // req.params에서 user_id 추출 및 검증
    const { user_id } = validateUserId(req.params);

    // 서비스 호출
    const regions = await getFilteredStarRegionsService(user_id);

    // 결과 반환
    res.status(200).json({ regions });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const setStarsName = async (req, res) => {
  try {
    console.log("별자리 이름 설정 요청 도착!");

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

    const updatedStars = await setStarsNameService(userId, name);

    res.status(StatusCodes.OK).json({
      message: "별자리 이름 설정 성공",
      stars: updatedStars,
    });
  } catch (error) {
    console.error("별자리 이름 설정 오류:", error);
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

module.exports = {
  getFilteredStarRegions,
  setStarsName,
  getStarsRanking,
  voteForStar,
};
