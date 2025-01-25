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

const getPostById = async (userId, postsId) => {
    await prisma.post.update({
        where: {
            author_id: userId,
            post_id: postsId
        },
        data: {
          views: {
            increment: 1
          }
        }
    });

    return prisma.post.findUnique({
        where: { 
            author_id: parseInt(userId),
            post_id: parseInt(postsId),
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

const deletePost = async (userId, postsId) => {
    return await prisma.post.delete({
        where: {
            author_id: parseInt(userId),
            post_id: parseInt(postsId),
        },
    });
};

module.exports = {
    findStarByRegion,
    findStarsByUserId,
    createStar,
    savePost,
    getPostById,
    updatePost,
    deletePost
};