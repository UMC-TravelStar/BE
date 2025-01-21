const { addPost, getPostById } = require("../repositories/post.repository.js");
const { responseFromPost, UserPostResponseDTO } = require("../dtos/post.dto.js");

const createPost = async (data) => {
    const postId = await addPost({
        title: data.title,
        location: data.location, // location 필드를 추가로 전달
        music: data.music || "",
        content: data.content,
        photos: data.photos,
        feeling: data.feeling
    });
    
    if (!postId) {
        throw new Error("게시글 생성에 실패했습니다. 동일한 제목의 게시글이 이미 존재할 수 있습니다.");
    }
    
    return responseFromPost({ id: postId, ...data });
};

const getUserPost = async (userId, postId) => {

    // 데이터베이스에서 게시글 가져오기
    const post = await getPostById(userId, postId);

    // 게시글이 없으면 null 반환
    if (!post) return null;

    // DTO 변환
    return new UserPostResponseDTO(post);
};

module.exports = {
    createPost,
    getUserPost
};