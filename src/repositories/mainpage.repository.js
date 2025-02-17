const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 일지 조회
const getUserPosts = async (skip, limit) => {
  return await prisma.post.findMany({
    include: {
      star: {
        select: { region: true }
      },
      post_images: {
        select: { imageUrl: true }
      },
      user: {
        select: {
          user_id: true, // user_id 추가 (친구 여부 확인용)
          nickname: true,
          u_image: { select: { file_name: true } }
        }
      }
    },
    orderBy: { updated_at: 'desc' },
    skip,
    take: limit
  });
};

// 일지 개수 카운트
const countUserPosts = async () => {
  return await prisma.post.count();
};

module.exports = {
  getUserPosts,
  countUserPosts
};
