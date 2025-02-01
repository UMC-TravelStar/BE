const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 일지 조회
const getUserPosts = async (skip, limit) => {
    return await prisma.post.findMany({
        include: {
            star: {
                select: {
                    region: true
                }
            },
            post_images: {
                select: {
                    file_name: true
                }
            },
            user: {
                select: {
                    nickname: true,
                    u_image: {
                        select: {
                            file_name: true
                        }
                    }
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