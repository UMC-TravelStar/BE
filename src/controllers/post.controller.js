const { 
    checkOrCreateStar, 
    registerPost,
    getUserPost, 
    editPost 
} = require("../services/post.service.js");
const { 
    deletePost 
} = require("../repositories/post.repository.js")
const { 
    bodyToPost, 
    EditPostDto 
} = require("../dtos/post.dto.js");
const { StatusCodes } = require("http-status-codes");

const handleAddPost = async (req, res) => {
    console.log("Request to add post received");
    console.log("Request body:", req.body);

    const { userId } = req.params;
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
          res.status(500).json({ message: error.message });
    }
}

const handleGetUserPost = async (req, res) => {
    console.log("Request to get user post");

    try {
        console.log(req.params);
        const { userId, postsId } = req.params;
        
        if (!userId || !postsId) {
            throw new Error('Missing required parameters: userId or postId');
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
        const { userId, postsId } = req.params;
        const editData = new EditPostDto(req.body);

        if (!userId || !postsId) {
            return res.status(400).json({ success: false, message: "일지 수정 실패 (userId or postsId 누락)" });
        }

        const post = await getUserPost(userId, postsId);

        if (!post) {
            return res.status(404).json({ success: false, message: "일지를 찾을 수 없음." });
        }

        const updatedPostId = await editPost(userId, postsId, editData);

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
        const { userId, postsId } = req.params;

        // 게시물 삭제 처리
        const deletedPost = await deletePost(userId, postsId);
        
        if (!deletedPost) {
            return res.status(404).json({ success: false, message: '일지를 찾을 수 없음.' });
        }

        res.status(200).json({ success: true, message: '일지 삭제 성공' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '서버 내부 오류' });
    }
};


module.exports = {
    handleAddPost,
    handleGetUserPost,
    handleEditPost,
    handleDeletePost
};
