// repositories/mainpage.repository.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUserPosts = async (skip, limit) => {
  return await prisma.post.findMany({
    include: {
      star: {
        select: { star_id: true, region: true },
      },
      post_images: {
        select: { imageUrl: true },
      },
      user: {
        select: {
          user_id: true,
          nickname: true,
          u_image: {
            select: { file_name: true },
          },
        },
      },
    },
    orderBy: { updated_at: 'desc' },
    skip,
    take: limit,
  });
};

const countUserPosts = async () => {
  return await prisma.post.count();
};

module.exports = {
  getUserPosts,
  countUserPosts,
};
