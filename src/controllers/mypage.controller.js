const MyPageService = require('../services/mypage.service');
const MyPageRepository = require('../repositories/mypage.repository');
const imageUploader = require("../middlewares/imageUploader.js");
const profileImageUploader = imageUploader("profile-image");

// 유저 정보 조회
const getMyPage = async (req, res) => {
    try{
        const userId = req.userId;
        const user = await MyPageService.findUserById(userId);
        res.status(200).json({
            resultType: 'success',
            message: '유저 정보 조회 성공',
            data: user
        });
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

// 유저 정보 수정
const updateMyPage = async (req, res) => {
    try{
        const userId = req.userId;
        const { nickname, name, birth, phonenum, email } = req.body;
        const user = await MyPageService.updateUserById(userId, { nickname, name, birth, phonenum, email });
        res.status(200).json({
            resultType: 'success',
            message: '유저 정보 수정 성공',
            data: user
        });
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

// 보관 글 목록 조회
const getStoragedPost = async (req, res) => {
    try{
        const userId = req.userId;
        const posts = await MyPageService.findStoragedPost(userId);
        res.status(200).json({
            resultType: 'success',
            message: '보관 글 목록 조회 성공',
            data: posts
        });
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

// 보관 글 상태 수정(보관->전체공개)
const updateStoragePost = async (req, res) => {
    try{
        const postId = req.params.postId;
        const post = await MyPageService.updateStoragePost(postId);
        res.status(200).json({
            resultType: 'success',
            message: '보관 글 상태 수정 성공',
            data: post
        });
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

// 프로필 사진 등록/수정 
const uploadUserImage = async (req, res) => {
    const userId = req.userId;

    profileImageUploader.single("images")(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: "파일 업로드 중 오류 발생", error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: "파일이 없어요.." });
        }

        const fileUrl = req.file.location;
        MyPageService.registerProfileImage(userId, fileUrl);
        
        return res.status(200).json({ message: "파일 업로드 성공", fileUrl });
    })
};

// 프로필 사진 삭제
const deleteUserImage = async (req, res) => {
    try {
        const userId = req.userId;
        const result = await MyPageService.deleteProfileImage(userId);

        if (result.message === "등록된 이미지가 없습니다.") {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "서버 오류", error: error.message });
    }
};

// 프로필 사진 조회
const getUserImage = async (req, res) => {
    try {
        const userId = req.userId;
        const image = await MyPageRepository.findPostImages(userId);
        console.log(`image: `, image);

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
    getMyPage,
    updateMyPage,
    getStoragedPost,
    updateStoragePost,
    uploadUserImage,
    deleteUserImage,
    getUserImage,
};