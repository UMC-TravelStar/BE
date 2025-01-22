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
            location: data.location,
            music: data.music || "",
            content: data.content,
            photos: data.photos,
            feeling: data.feeling,
            author_id: data.author_id,
            region: data.region || "default_region", 
            detail_reg: data.detail_reg || "default_detail_reg",
            feel_color: data.feel_color
        },
    });

    return createdPost.post_id; // 생성된 게시글의 ID 반환
};

module.exports = {
    addPost
};