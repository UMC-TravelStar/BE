const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

const addPost = async (data) => {
    const existingPost = await prisma.post.findFirst({
        where: { 
            title: data.title, 
            author_id: data.author_id // 게시글 작성자 확인
        }
    });

    if (existingPost) {
        throw new Error("작성자가 이미 같은 제목의 게시글을 작성했습니다.");
    }

    const createdPost = await prisma.post.create({
        data: {
            title: data.title,
            location: data.location,
            music: data.music || "",
            content: data.content,
            photos: data.photos,
            feeling: data.feeling,
            author_id: data.author_id // 작성자 ID
        },
    });

    return createdPost.post_id; // 생성된 게시글의 ID 반환
};

const getPostById = async (userId, postId) => {
    return prisma.post.findUnique({
        where: { 
            id: parseInt(post_id),
            authorId: parseInt(user_id),
         },
    });
};

module.exports = {
    addPost,
    getPostById
};