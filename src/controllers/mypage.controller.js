const MyPageService = require('../services/mypage.service');

const getMyPage = async (req, res) => {
    try{
        const userId = req.userId;
        const user = await MyPageService.findUserById(userId);
        res.status(200).json(user);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = { getMyPage };