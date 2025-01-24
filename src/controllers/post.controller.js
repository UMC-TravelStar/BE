const { createPost, getUserPost } = require("../services/post.service.js");
const { bodyToPost } = require("../dtos/post.dto.js");
const { StatusCodes } = require("http-status-codes");

const handleAddPost = async (req, res, next) => {
    console.log("Request to add post received");
    console.log("Request body:", req.body);

    try {
        // 요청 Body를 DTO로 변환
        const postData = bodyToPost(req.body);

        // 서비스 호출로 게시물 생성
        const postResponse = await createPost(postData);

        // 성공 응답 반환
        res.status(StatusCodes.CREATED).json({
            message: "게시글 작성 성공",
            post: postResponse,
        });
    } catch (error) {
        console.error("Error while creating post:", error.message);

        // 실패 응답 반환
        res.status(StatusCodes.BAD_REQUEST).json({
            message: "게시글 작성 실패",
            error: error.message,
        });
    }
};

const handleGetUserPost = async (req, res) => {
    console.log("Request to get user post");

    try {
        console.log(req.params);
        const { userId, postId } = req.params;
        
        if (!userId || !postId) {
            throw new Error('Missing required parameters: userId or postId');
        }

        // 서비스 호출
        const post = await getUserPost(userId, postId);

        if (!post) {
            return res.status(404).json({ success: false, message: "게시글을 찾을 수 없음." });
        }

        res.status(200).json({
            message: "게시글 조회 성공",
            post,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "서버 내부 오류" });
    }
};

module.exports = {
    handleAddPost,
    handleGetUserPost
};
