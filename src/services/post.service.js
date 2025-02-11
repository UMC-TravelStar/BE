const { 
    findStarByRegion, 
    findStarsByUserId,
    checkFriendship,
    createStar, 
    savePost, 
    getPostById, 
    getFrPost,
    getFrPost2,
    getPostList,
    getPostList2,
    updatePost, 
    getStarById,
    getPostById2,
    getRelatedPostsByStarId,
    deletePost,
    deleteStar,
    getAllUserPosts,
    createComment,
    findPostImages,
    deleteImageDB,
} = require("../repositories/post.repository.js");
const { 
    UserPostResponseDTO,
    formatPostResponse,
    PostResponseDTO
} = require("../dtos/post.dto.js");
const { deleteImage } = require("../middlewares/deleteImage.js");

const checkOrCreateStar = async (userId, region) => {
    console.log("Checking or creating star for userId:", userId, "region:", region);

    // 별자리 아이디 찾기
    const stars = await findStarsByUserId(userId);
    console.log("Stars ID for user:", stars.stars_id);

    // 별자리에서 해당 region에 맞는 별을 찾는다
    let star = await findStarByRegion(region, stars.stars_id);
    console.log("Found star:", star);

    if (!star) {
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

const listUserPosts = async (userId, page, limit) => {
    const skip = (page - 1) * limit;
    const posts = await getAllUserPosts(skip, userId);

    if (!Array.isArray(posts)) {
        throw new Error('Posts is not an array');
    }

    if (posts.length === 0) {
        return []; // 빈 배열을 반환할 경우
    }
    
    return posts.map(formatPostResponse);
};

const getUserPost = async (userId, postsId) => {
    // 데이터베이스에서 일지 가져오기
    const post = await getPostById(userId, postsId);

    // 일지가 없으면 null 반환
    if (!post) return null;

    const star = await getStarById(post.star_id);

    // DTO 변환
    return new UserPostResponseDTO(post, star);
};

const getPostWithStatus = async (userId, viewerId, page, limit) => {
    const isFriend = await checkFriendship(userId, viewerId);
    console.log(`isFriend: `, isFriend);

    const skip = (page - 1) * limit;

    let posts
    if (isFriend) {
        posts = await getFrPost(skip, userId);
    } else {
        posts = await getPostList(skip, userId);
        console.log(`getPostLists: `, posts);
    }

    if (posts.length === 0) {
        return []; // 빈 배열을 반환할 경우
    }
    return posts.map(post => new PostResponseDTO(post));
};

const getPost = async (userId, viewerId, postsId) => {
    const isFriend = await checkFriendship(userId, viewerId);
    console.log(`isFriend: `, isFriend);

    let posts
    if (isFriend) {
        posts = await getFrPost2(userId, postsId);
    } else {
        posts = await getPostList2(userId, postsId);
    }
    console.log(posts);

    return posts
};

const checkUserPost = async (userId, postsId) => {
    return getPostById(userId, postsId);
};

const editPost = async (post, editData) => {
    // 게시글 수정
    const updatedPost = await updatePost(post, editData);

    return updatedPost;
};

const deleteUserPost = async (userId, postsId) => {
    try {
        // 게시글 가져오기
        const post = await getPostById2(userId, postsId);
        console.log(post);

        if (!post) {
            console.log("Post not found.");
            return null;
        }

        const starId = post.star_id; 

        // 게시글 삭제
        await deletePost(userId, postsId);
        console.log(`Post (ID: ${postsId}) deleted successfully.`);

        const relatedPosts = await getRelatedPostsByStarId(starId);
        if (relatedPosts.length === 0) {
            await deleteStar(starId);
            console.log("Star deleted successfully");
        }
        
        return { success: true, message: '일지 삭제 성공' };
    } catch (error) {
        console.error("Error in deleteUserPost:", error);
        throw error;
    }
};

const registerComment = async (userId, comment) => {
    const commentData = await createComment(userId, comment);

    return commentData;
};

// ✅ 특정 게시글의 모든 이미지 삭제 함수
const deletePostImages = async (posts_id) => {
    // 🔹 1. posts_id에 해당하는 이미지들 조회
    const postImages = await findPostImages(posts_id);

    if (postImages.length === 0) {
        return { message: "해당 게시글에 등록된 이미지가 없습니다." };
    }

    // 🔹 2. S3에서 이미지 삭제 (posts 폴더)
    const imageUrls = postImages.map(img => img.imageUrl);
    await deleteImage("posts", imageUrls);

    // 🔹 3. DB에서 이미지 데이터 삭제
    await deleteImageDB(posts_id);

    return { message: "해당 게시글의 모든 이미지 삭제 완료" };
};

module.exports = {
    checkOrCreateStar,
    registerPost,
    listUserPosts,
    getUserPost,
    getPost,
    getPostWithStatus,
    checkUserPost,
    editPost,
    deleteUserPost,
    registerComment,
    deletePostImages,
};