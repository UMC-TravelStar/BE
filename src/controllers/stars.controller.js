const { StatusCodes } = require("http-status-codes");
const {
  getFilteredStarRegionsService,
  setStarsNameService,
  getStarsRankingService,
} = require("../services/stars.service.js");
const { extractUserIdFromToken } = require("../dtos/stars.dto.js");

const getFilteredStarRegions = async (req, res, next) => {
  try {
    console.log("별 region 필터링 요청 도착!");

    const userId = extractUserIdFromToken(req);

    if (!userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "로그인이 필요합니다." });
    }

    const regions = await getFilteredStarRegionsService(userId);

    res.status(StatusCodes.OK).json({
      message: "조건에 맞는 별의 region 조회 성공",
      regions,
    });
  } catch (error) {
    console.error("별 region 필터링 오류:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "서버 오류가 발생했습니다.",
      error: error.message,
    });
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

module.exports = {
  getFilteredStarRegions,
  setStarsName,
  getStarsRanking,
};
