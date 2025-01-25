const { 
    findStarByRegion, 
    findStarsByUserId,
    createStar, 
    savePost, 
    getPostById, 
    updatePost, 
    getStarById,
} = require("../repositories/post.repository.js");
const { 
    UserPostResponseDTO 
} = require("../dtos/post.dto.js");

const checkOrCreateStar = async (userId, region) => {
    console.log("Checking or creating star for userId:", userId, "region:", region);

    // 별자리에서 해당 region에 맞는 별을 찾는다
    let star = await findStarByRegion(region);
    console.log("Found star:", star);

    if (!star) {
        // 별자리 아이디 찾기
        const stars = await findStarsByUserId(userId);
        console.log("Stars ID for user:", stars.stars_id);

        // 별이 없다면 새로 생성
        star = await createStar(region, stars.stars_id);
        console.log("Created Star ID:", star.star_id);
    }

    return star.star_id;
};

const registerPost = async (userId, starId, postData) => {
    const newPost = await savePost(userId, starId, postData);
    return newPost;
};

const getUserPost = async (userId, postsId) => {

    // 데이터베이스에서 게시글 가져오기
    const post = await getPostById(userId, postsId);

    // 게시글이 없으면 null 반환
    if (!post) return null;

    const star = await getStarById(post.star_id);

    // DTO 변환
    return new UserPostResponseDTO(post, star);
};

const editPost = async (userId, postsId, editData) => {
    // 게시글 수정
    const updatedPost = await updatePost(userId, postsId, editData);

    return updatedPost;
};

module.exports = {
    checkOrCreateStar,
    registerPost,
    getUserPost,
    editPost
};