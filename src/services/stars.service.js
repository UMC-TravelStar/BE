const redisClient = require("../config/redisClient");
const {
  findStarsByUserId,
  findFilteredStarRegions,
  updateStarsNameByUserId,
  findTopStars,
} = require("../repositories/stars.repository.js");

const getFilteredStarRegionsService = async (userId) => {
  // 사용자 관련 별자리 정보 조회
  const userStars = await findStarsByUserId(userId);

  if (!userStars) {
    throw new Error("별자리를 찾을 수 없습니다.");
  }

  // stars 테이블의 updated_at 값을 기준으로 star 테이블의 region 필터링
  const stars = await findFilteredStarRegions(
    userStars.stars_id,
    userStars.updated_at
  );

  // region 배열 반환
  return stars.map((star) => star.region);
};

const setStarsNameService = async (userId, name) => {
  // 별자리 이름 업데이트
  const updatedStars = await updateStarsNameByUserId(userId, name);

  if (!updatedStars) {
    throw new Error("별자리 이름 업데이트 실패");
  }

  return updatedStars;
};

// const getStarsRankingService = async () => {
//   // 상위 10개의 별자리 조회
//   const starsRanking = await findTopStars();

//   if (!starsRanking || starsRanking.length === 0) {
//     throw new Error("별자리 랭킹 데이터를 찾을 수 없습니다.");
//   }

//   return starsRanking;
// };
const getStarsRankingService = async () => {
  const cacheKey = "stars_ranking";

  try {
    // Redis에서 캐시된 데이터 확인
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("✅ Redis 캐시 데이터 반환");
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error("🚨 Redis 조회 오류:", error);
  }

  // Redis에 데이터가 없으면 DB에서 조회
  const rankings = await findTopStars();

  try {
    await redisClient.set(cacheKey, 600, JSON.stringify(rankings));
    console.log("✅ Redis 캐시에 저장 완료!");
  } catch (error) {
    console.error("🚨 Redis 캐싱 실패:", error);
  }

  return rankings;
};

module.exports = {
  getFilteredStarRegionsService,
  setStarsNameService,
  getStarsRankingService,
};
