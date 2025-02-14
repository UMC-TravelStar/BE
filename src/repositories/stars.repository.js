const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

// 사용자 ID로 별자리 조회
const findStarsByUserId = async (userId) => {
  return await prisma.stars.findUnique({
    where: {
      user_id: String(userId), // user_id를 그대로 사용
    },
    select: {
      stars_id: true,
      updated_at: true, // updated_at 값을 가져옴
    },
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
  const AWS_REGION = process.env.AWS_REGION || "ap-northeast-2";
  const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
  const result = await prisma.stars.findMany({
    orderBy: {
      vote_num: "desc",
    },
    take: 10,
    select: {
      stars_id: true,
      user_id: true,
      name: true,
      vote_num: true,
      views: true,
      created_at: true,
    },
  });

  const starsWithImages = result.map((star) => ({
    ...star,
    imageUrl: `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/stars/${star.user_id}.png`,
  }));

  console.log("findTopStars starsWithImages:", starsWithImages); // 쿼리 결과 출력
  return starsWithImages;
};

module.exports = {
  findStarsByUserId,
  findFilteredStarRegions,
  updateStarsNameByUserId,
  findTopStars,
};
