const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// 사용자 관련 별자리 정보 조회
const findStarsByUserId = async (userId) => {
  return await prisma.stars.findFirst({
    where: { user_id: userId },
  });
};

// 특정 조건에 따라 star 테이블에서 region 조회
const findFilteredStarRegions = async (starsId, updatedAt) => {
  return await prisma.star.findMany({
    where: {
      stars_id: starsId, // stars 테이블의 별자리 ID와 연결된 별만 조회
      created_at: {
        lt: updatedAt, // stars 테이블의 updated_at 이전에 생성된 별
      },
    },
    select: {
      region: true, // region 값만 선택
    },
  });
};

// 사용자 ID를 기반으로 별자리 이름 업데이트
const updateStarsNameByUserId = async (userId, name) => {
  return await prisma.stars.update({
    where: { user_id: userId },
    data: { name },
  });
};

// 상위 10개의 별자리 조회
const findTopStars = async () => {
  const result = await prisma.stars.findMany({
    orderBy: {
      vote_num: "desc",
    },
    take: 10,
    select: {
      stars_id: true,
      name: true,
      vote_num: true,
      views: true,
      created_at: true,
    },
  });
  console.log("findTopStars result:", result); // 쿼리 결과 출력
  return result;
};

module.exports = {
  findStarsByUserId,
  findFilteredStarRegions,
  updateStarsNameByUserId,
  findTopStars,
};
