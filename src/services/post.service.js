const axios = require('axios');
const dotenv = require('dotenv');
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
    findPostImage,
    deleteImageDB,
    deleteImageDB2,
    deleteImageDB3,
    checkBackImage,
    createBack,
    updateBack,
} = require("../repositories/post.repository.js");
const { 
    UserPostResponseDTO,
    formatPostResponse,
    PostResponseDTO
} = require("../dtos/post.dto.js");
const { deleteImage } = require("../middlewares/deleteImage.js");

// moni
dotenv.config();
const OPEN_API_KEY = process.env.OPEN_API_KEY;
const OPEN_API_URL = 'https://api.openai.com/v1/chat/completions';

const checkOrCreateStar = async (userId, region) => {
    try {
        console.log("Checking or creating star for userId:", userId, "region:", region);

        // 별자리 아이디 찾기
        console.log(typeof findStarsByUserId)
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
    } catch (error) {
        console.error("Error in findStarsByUserId:", error);
    }
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
    return getPostById2(userId, postsId);
};

const editPost = async (post, editData) => {
    // 게시글 수정
    const updatedPost = await updatePost(post, editData);

    return updatedPost;
};

const deleteBackImage = async (url, userId) => {
    await deleteImage("backImages", [url]);
    await deleteImageDB3(userId);

    return { success: true, message: '일지 삭제 성공' };
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

        const postImages = await findPostImages(postsId);

        if (postImages.length != 0) {
            const imageUrls = postImages.map(img => img.imageUrl);
            await deleteImage("posts", imageUrls);
        
            await deleteImageDB2(postsId);
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

// ✅ 특정 게시글의 이미지 1개 삭제 함수
const deletePostImages = async (postId, url_id) => {
    // 🔹 1. posts_id에 해당하는 이미지 조회
    const postImage = await findPostImage(postId, url_id);

    if (!postImage) {
        return { message: "해당 등록된 이미지가 없습니다." };
    }

    // 🔹 2. S3에서 이미지 삭제 (posts 폴더)
    await deleteImage("posts", [postImage.imageUrl]);

    // 🔹 3. DB에서 이미지 데이터 삭제
    await deleteImageDB(postId, url_id);

    return { message: "해당 이미지 삭제 완료" };
};

const registerBackImage = async (userId, file) => {
    // 1. 원래 배경화면이 있는지 확인
    const checkBack = await checkBackImage(userId);
    console.log(`checkBack: `, checkBack);

    // 2. 배경화면이 없다면 생성 / 있다면 데이터 바꾸기
    let image;

    if (!checkBack) {
        image = await createBack(userId, file);
    }
    else {
        image = await updateBack(userId, file);

        await deleteImage("backImages", [checkBack.file_name]);
    }

    return image.file_name;
};

// 감정 분석
const analyzeFeeling = async (review) => {
    const prompt = `
    사용자가 남긴 감상평:
    "${review}"

    아래 5가지 감정 분류 중 해당하는 감정을 선택하고,
    해당 감정의 번호(feel_color)와 간단한 감정 분석(feeling)을 아래와 같이 JSON 형식으로 반환해줘.

    1: 화남, 분노
    2: 슬픔, 우울
    3: 기쁨, 행복
    4: 성장, 도전
    5: 평온, 힐링

    예시 출력: 
    {
        "feel_color": 3,
        "feeling": "당신의 여행은 행복한 상태군요."
    }
    `;

    // GPT API 호출
    let response;
    try{
        response = await axios.post(OPEN_API_URL, 
        {
            model: 'gpt-4',
            messages: [{role: 'system', content: prompt}],
            max_tokens: 100,
            temperature: 0.7,
        },
        {
            headers: {
                'Authorization': `Bearer ${OPEN_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        throw {
            statusCode: error.response?.status || 500,
            message: error.response?.data || 'GPT API 호출 오류'
        }
    }

    const reply = response.data.choices[0].message.content;
    let result;
    try{
        result = JSON.parse(reply);
    } catch (error) {
        throw {
            statusCode: 500,
            message: '감정 분석 결과 파싱 오류'
        }
    }

    // post 테이블에 덮어쓰기(업데이트)
    // try{
    //     await updateFeeling(postId, result.feelingType, result.feelingComment);
    // } catch (error) {
    //     throw {
    //         statusCode: error.statusCode || 500,
    //         message: error.message || 'DB 업데이트 오류'
    //     }
    // }

    return result;
}

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
    deleteBackImage,
    registerBackImage,
    analyzeFeeling,
};