const redisClient = require("../config/redisClient");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); // Prisma 클라이언트 인스턴스 생성

const {
  findStarsByUserId,
  findFilteredStarRegions,
  updateStarsNameByUserId,
  findTopStars,
} = require("../repositories/stars.repository.js");
const getFilteredStarRegionsService = async (starsId) => {
  // stars_id로 region 조회
  const stars = await findFilteredStarRegions(starsId);

  if (!stars.length) {
    throw new Error("해당 별자리의 지역 정보를 찾을 수 없습니다.");
  }

  // region 배열 반환
  // return stars.map((star) => star.region);
  return stars.map((star) => ({
    id: star.star_id,
    region: star.region,
    feel_color: star.posts?.length > 0 ? star.posts[0].feel_color : null, }))
};

const setStarsNameService = async (userId, name) => {
  // 별자리 이름 업데이트
  const updatedStars = await updateStarsNameByUserId(userId, name);

  if (!updatedStars) {
    throw new Error("별자리 이름 업데이트 실패");
  }

  return updatedStars;
};

const getStarsRankingService = async () => {
  const cacheKey = "stars_ranking";

  try {
    // Redis에서 캐시된 데이터 확인
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Redis 캐시 데이터 반환");
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error("Redis 조회 오류:", error);
  }

  // Redis에 데이터가 없으면 DB에서 조회
  const rankings = await findTopStars();

  try {
    // 600초 만료 설정 추가
    await redisClient.set(cacheKey, JSON.stringify(rankings), { EX: 600 });
    console.log("Redis 캐시에 저장 완료!");
  } catch (error) {
    console.error("Redis 캐싱 실패:", error);
  }

  return rankings;
};

const voteForStarService = async (tokenUserId, starsId, postUserId) => {
  // 자신이 작성한 게시글인지 확인
  if (tokenUserId === postUserId) {
    throw new Error("자신의 별자리에 투표할 수 없습니다.");
  }

  // 중복 투표 확인
  const existingVote = await prisma.votes.findUnique({
    where: {
      user_id_stars_id: {
        user_id: tokenUserId,
        stars_id: starsId,
      },
    },
  });

  if (existingVote) {
    throw new Error("이미 이 별자리에 투표하셨습니다.");
  }

  // 투표 기록 추가
  await prisma.votes.create({
    data: {
      user_id: tokenUserId,
      stars_id: starsId,
    },
  });

  // 별자리 투표 수 증가
  const updatedStar = await prisma.stars.update({
    where: { stars_id: starsId },
    data: { vote_num: { increment: 1 } },
  });

  return updatedStar;
};

const checkIfUserVotedService = async (userId, starsId) => {
  const existingVote = await prisma.votes.findUnique({
    where: {
      user_id_stars_id: {
        user_id: userId,
        stars_id: starsId,
      },
    },
  });

  return existingVote ? 1 : 0; // 투표한 경우 1, 아니면 0 반환
};

const checkStarRankingApplicationService = async (userId) => {
  const userStar = await prisma.stars.findUnique({
    where: { user_id: userId },
    select: { name: true },
  });
  //console.log("🚀 [DEBUG] userStar 데이터:", userStar); // 🔥 현재 DB 값 확인
  //console.log("🚀 [DEBUG] userStar.name 타입:", typeof userStar?.name); // 🔥 타입 확인

  return userStar && userStar.name !== "0" ? 1 : 0; // "0"이면 신청 안함, 아니면 신청됨
};

module.exports = {
  getFilteredStarRegionsService,
  setStarsNameService,
  getStarsRankingService,
  voteForStarService,
  checkIfUserVotedService,
  checkStarRankingApplicationService,
};
