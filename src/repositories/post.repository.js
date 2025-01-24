const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

const addPost = async (data) => {
    const existingPost = await prisma.post.findFirst({
        where: { 
            title: data.title
        }
    });

    if (existingPost) {
        throw new Error("작성자가 이미 같은 제목의 게시글을 작성했습니다.");
    }

    const createdPost = await prisma.post.create({
        data: {
            title: data.title,
            music: data.music || "",
            content: data.content,
            photos: data.photos,
            feeling: data.feeling,
            author_id: data.author_id,
            region: data.region || "default_region", 
            feel_color: data.feel_color
        },
    });

    return createdPost.post_id; // 생성된 게시글의 ID 반환
};

const getPostById = async (userId, postsId) => {
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

module.exports = {
    addPost,
    getPostById,
    updatePost
};