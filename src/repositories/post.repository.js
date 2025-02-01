const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

const findStarByRegion = async (region) => {
    const existingStar = await prisma.star.findFirst({
        where: {
            region: region,
        },
    });

    console.log(existingStar)
    return existingStar;
};

const findStarsByUserId = async (userId) => {
    const stars = await prisma.stars.findFirst({
        where: {
            user_id: userId, // userId 조건 설정
        },
    });

    return stars; 
};

const createStar = async (region, starsId) => {
    try {
        const star = await prisma.star.create({
            data: {
                region: region,
                stars: {
                    connect: { stars_id: starsId }, // starsId와 연결
                },
            }});
        return star; // star 객체를 반환
    } catch (error) {
        throw new Error(error); // 오류 발생 시 처리
    }
};



const savePost = async (userId, starId, postData) => {
    if (!starId) {
        throw new Error('Star ID is required');
    }

    return await prisma.post.create({
        data: {
            title: postData.title,
            content: postData.content,
            music: postData.music,
            feeling: postData.feeling,
            storage: postData.storage,
            user: {
                connect: { user_id: userId },  // user와 연결 (user_id를 통해)
            },
            star: {
                connect: { star_id: starId },  // star와 연결
            },
        },
    });
};

const getAllUserPosts = async (skip, userId) => {
    const posts = await prisma.post.findMany({
        select: {
            post_id: true,
            title: true,
            created_at: true,
            star: {
                select: {
                    star_id: true,
                    region: true, // star 테이블의 region 컬럼 추가
                }
            }
        },
        where: {
            user_id: userId,
        },
        orderBy: { post_id: "desc" },
        skip, // 앞에서 skip 개수만큼 건너뛰기
        take: 10, // 가져올 개수
    });

    console.log(posts); // 반환된 posts 확인
    return posts;
};

const getPostById = async (userId, postsId) => {
    await prisma.post.update({
        where: {
            user_id: userId,
            post_id: parseInt(postsId),
        },
        data: {
          views: {
            increment: 1
          }
        }
    });

    return prisma.post.findUnique({
        where: { 
            user_id: userId,
            post_id: parseInt(postsId),
        },
    });
};

const getStarById = async (starId) => {
    return prisma.star.findUnique({
        where: {
            star_id: parseInt(starId)
        },
    });
};

const updatePost = async (userId, postsId, editData) => {
    return await prisma.post.update({
        where: { 
            author_id: parseInt(userId),
            post_id: parseInt(postsId) 
        },
        data: editData,
    });
}

const getPostById2 = async (userId, postsId) => {
    return prisma.post.findUnique({
        where: { 
            user_id: userId,
            post_id: parseInt(postsId),
        },
    });
};

const getRelatedPostsByStarId = async (starId) => {
    return await prisma.post.findMany({
        where: { 
            star_id: parseInt(starId)
        },
    });
};

const deletePost = async (userId, postsId) => {
    return await prisma.post.delete({
        where: {
            user_id: userId,
            post_id: parseInt(postsId),
        },
    });
};

const deleteStar = async (starId) => {
    return await prisma.star.delete({
        where: {
            star_id: parseInt(starId)
        },
    });
};

module.exports = {
    findStarByRegion,
    findStarsByUserId,
    createStar,
    savePost,
    getPostById,
    getStarById,
    updatePost,
    getPostById2,
    getRelatedPostsByStarId,
    deletePost,
    deleteStar,
    getAllUserPosts,
};