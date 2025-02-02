const MyPageService = require('../services/mypage.service');

// 유저 정보 조회
const getMyPage = async (req, res) => {
    try{
        const userId = req.userId;
        const user = await MyPageService.findUserById(userId);
        res.status(200).json(user);
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
        res.status(200).json(user);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

// 보관 글 목록 조회
const getStoragedPost = async (req, res) => {
    try{
        const userId = req.userId;
        const posts = await MyPageService.findStoragedPost(userId);
        res.status(200).json(posts);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = { 
    getMyPage,
    updateMyPage
};