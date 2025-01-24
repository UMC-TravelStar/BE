const { addPost, getPostById, updatePost } = require("../repositories/post.repository.js");
const { responseFromPost, UserPostResponseDTO } = require("../dtos/post.dto.js");

const createPost = async (data) => {
    const postId = await addPost({
        title: data.title,
        music: data.music || "",
        content: data.content,
        photos: data.photos,
        feeling: data.feeling,
        author_id: data.author_id,
        region: data.region || "default_region",  
        feel_color: data.feel_color
    });
    
    if (!postId) {
        throw new Error("게시글 생성에 실패했습니다. 동일한 제목의 게시글이 이미 존재할 수 있습니다.");
    }
    
    return responseFromPost({ id: postId, ...data });
};

const getUserPost = async (userId, postsId) => {

    // 데이터베이스에서 게시글 가져오기
    const post = await getPostById(userId, postsId);

    // 게시글이 없으면 null 반환
    if (!post) return null;

    // DTO 변환
    return new UserPostResponseDTO(post);
};

const editPost = async (userId, postsId, editData) => {
    // 해당 게시글이 존재하는지 확인
    const post = await getPostById(userId, postsId);
    if (!post) return null;

    // 게시글 수정
    const updatedPost = await updatePost(userId, postsId, editData);

    return updatedPost;
};

module.exports = {
    createPost,
    getUserPost,
    editPost
};