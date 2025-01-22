const { addPost } = require("../repositories/post.repository.js");
const { responseFromPost } = require("../dtos/post.dto.js");

const createPost = async (data) => {
    const postId = await addPost({
        title: data.title,
        location: data.location, // location 필드를 추가로 전달
        music: data.music || "",
        content: data.content,
        photos: data.photos,
        feeling: data.feeling,
        author_id: data.author_id,
        region: data.region || "default_region",  
        detail_reg: data.detail_reg || "default_detail_reg",
        feel_color: data.feel_color
    });
    
    if (!postId) {
        throw new Error("게시글 생성에 실패했습니다. 동일한 제목의 게시글이 이미 존재할 수 있습니다.");
    }
    
    return responseFromPost({ id: postId, ...data });
};

module.exports = {
    createPost
};