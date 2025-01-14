import { createPost } from "../services/post.service.js";
import { bodyToPost } from "../dtos/post.dto.js";
import { StatusCodes } from "http-status-codes";

export const handleAddPost = async (req, res, next) => {
    console.log("Request to add post received");
    console.log("Request body:", req.body);

    try {
        // 요청 Body를 DTO로 변환
        const postData = bodyToPost(req.body);

        // 서비스 호출로 게시물 생성
        const post = await createPost(postData);

        // 성공 응답 반환
        res.status(StatusCodes.CREATED).json({
            message: "게시글 작성 성공",
            post_id: post.id,
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
