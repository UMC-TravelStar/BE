const { 
    findStars,
    checkOrCreateStar, 
    registerPost,
    listUserPosts,
    getUserPost, 
    getPostWithStatus,
    getPost,
    checkUserPost,
    editPost,
    deleteUserPost,
    registerComment,
    deletePostImages,
    registerBackImage,
} = require("../services/post.service.js");
const { 
    EditPostDto 
} = require("../dtos/post.dto.js");
const {
    registerPostImages,
    getComment,
    getImage
} = require("../repositories/post.repository.js")
const imageUploader = require("../middlewares/imageUploader.js");
const postImageUploader = imageUploader("posts");
const backImageUploader = imageUploader("backImages");
const { StatusCodes } = require("http-status-codes");

const handleAddPost = async (req, res) => {
    console.log("Request to add post received");
    console.log("Request body:", req.body);

    const userId = req.userId;
    const { region, ...restOfData } = req.body;

    try {
        // userId에 해당하는 별자리의 별이 존재하는지 확인
        const starId = await checkOrCreateStar(userId, region);
        console.log("Star ID:", starId);

        // 서비스 호출로 일지 생성
        const diary = await registerPost(userId, starId, restOfData);

        res.status(201).json({
            message: '일지 작성 성공',
            data: diary,
          });
        } catch (error) {
          res.status(400).json({ message: error.message });
    }
};

const handleListUserPost = async (req, res) => {
    
    try {
        const userId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const posts = await listUserPosts(userId, page, limit);

        return res.status(200).json({ 
            message: '일지 조회 성공',
            data: posts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 내부 오류" });
    }
};

const handleGetPost = async (req, res) => {
    try {
        const userId = req.params.userId.toString(); // 조회할 postId & 작성자 userId
        const viewerId = req.userId; // JWT에서 가져온 현재 로그인 유저 ID
        console.log('viewerId:', viewerId);
        const page = parseInt(req.query.page) || 1;
        const limit = 10;

        const result = await getPostWithStatus(userId, viewerId, page, limit);

        if (!result) {
            return res.status(404).json({ message: "해당 게시글을 찾을 수 없습니다." });
        }

        return res.status(200).json({ message: "조회 성공", data: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "서버 오류" });
    }
};

const handleGetUPost = async (req, res) => {
    try {
        const { postsId, userId } = req.params;
        const viewerId = req.userId;

        const post = await getPost(userId, viewerId, postsId);

        if (!post) {
            return res.status(404).json({ message: "해당 게시글을 찾을 수 없습니다." });
        }

        return res.status(200).json({ message: "조회 성공", data: post });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "서버 오류" });
    }
};

const handleGetUserPost = async (req, res) => {
    console.log("Request to get user post");

    try {
        console.log(req.params);
        const userId = req.userId;
        const postsId = req.params.postsId;
        
        if (!userId || !postsId) {
            return res.status(400).json({ success: false, message: "일지 조회 실패 (userId or postsId 누락)" });
        }

        // 서비스 호출
        const post = await getUserPost(userId, postsId);

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

const handleEditPost = async (req, res) => {
    console.log("Request to edit user post");
    console.log("Request body:", req.body);

    try {
        const userId = req.userId;
        const postsId = req.params.postsId;
        const editData = new EditPostDto(req.body);

        if (!userId || !postsId) {
            return res.status(400).json({ success: false, message: "일지 수정 실패 (userId or postsId 누락)" });
        }

        const post = await checkUserPost(userId, postsId);

        if (!post) {
            return res.status(404).json({ success: false, message: "일지를 찾을 수 없음." });
        }

        const updatedPostId = await editPost(post, editData);

        res.status(200).json({
            success: true,
            message: "일지 수정 성공",
            postId: updatedPostId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "서버 내부 오류" });
    }
};

const handleDeletePost = async (req, res) => {
    console.log("Request to delete user post");

    try {
        const userId = req.userId;
        const postsId = req.params.postsId;
        
        if (!userId || !postsId) {
            return res.status(400).json({ success: false, message: "일지 삭제 실패 (userId or postsId 누락)" });
        }
        
        const deletePost = await deleteUserPost(userId, postsId);

        if (!deletePost) {
            return res.status(404).json({ success: false, message: '일지를 찾을 수 없음.' });
        }

        res.status(200).json({ success: true, message: deletePost.message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '서버 내부 오류' });
    }
};

const handleAddComment = async (req, res) => {
    try {
        const userId = req.userId;
        const comment = req.body;

        const commentData = await registerComment(userId, comment);

        res.status(200).json({
            message: '코멘트 등록 성공',
            data: commentData.comment,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const handleGetComment = async (req, res) => {
    try {
        const userId = req.userId;
        
        const comment = await getComment(userId);

        if (!comment) {
            return res.status(400).json({ message: "코멘트가 없습니다!" });
        }

        res.status(200).json({
            message: "코멘트 조회 성공",
            data: comment,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const uploadPostImages = (req, res) => {
    postImageUploader.array("images")(req, res, (err) => {
        if (err) {
        return res.status(500).json({ message: "파일 업로드 중 오류 발생", error: err.message });
        }

        if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "파일 업로드 실패" });
        }

        const fileUrls = req.files.map(file => file.location);

        const posts_id = parseInt(req.params.posts_id);
        const images = registerPostImages(posts_id, fileUrls);
        console.log(`images url db에 저장`, images);

        return res.status(200).json({ message: "파일 업로드 성공", fileUrls });
    });
};

const uploadBackImages = (req, res) => {
    const userId = req.userId;

    backImageUploader.single("images")(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: "파일 업로드 중 오류 발생", error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: "파일이 없어요.." });
        }

        const fileUrl = req.file.location;
        const image = registerBackImage(userId, fileUrl);
        console.log(`image url db에 저장`, image);

        return res.status(200).json({ message: "파일 업로드 성공", fileUrl });
    });
};

const deletePostImagesController = async (req, res) => {
    try {
        const posts_id = parseInt(req.params.posts_id);
        const result = await deletePostImages(posts_id);

        if (result.message === "해당 게시글에 등록된 이미지가 없습니다.") {
            return res.status(404).json(result); // 404: 이미지가 없음
        }

        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "서버 오류", error: error.message });
    }
};

const getBackImages = async (req, res) => {
    try {
        const user_id = req.userId;
        const image = await getImage(user_id);

        if (!image) {
            return res.status(400).json({ message: "등록된 배경사진이 없습니다." });
        }

        return res.status(200).json({
            data: image.file_name
        });
    } catch (error) {
        res.status(500).json({ message: "서버 오류", error: error.message });
    }
};

module.exports = {
    handleAddPost,
    handleListUserPost,
    handleGetUserPost,
    handleGetPost,
    handleGetUPost,
    handleEditPost,
    handleDeletePost,
    handleAddComment,
    handleGetComment,
    uploadPostImages,
    deletePostImagesController,
    uploadBackImages,
    getBackImages
};
