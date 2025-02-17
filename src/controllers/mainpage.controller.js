const { listUserPosts, searchPosts, recordSearch, getSearchRankings } = require("../services/mainpage.service");
const { StatusCodes } = require("http-status-codes");

// 포스트 조회 핸들러
const handleListMainPost = async (req, res) => {
    const userId = req.userId;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 10;

    try {
        const postData = await listUserPosts(userId, page, limit);
        return res.status(StatusCodes.OK).json({
            message: '포스트 조회 성공',
            data: postData
        });
    } catch (error) {
        console.error("포스트 조회 오류:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 내부 오류" });
    }
};

// 검색 핸들러
const handleSearchPosts = async (req, res) => {
    const userId = req.userId;

    try {
        const { term } = req.query;
        if (!term) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "검색어가 필요합니다." });
        }

        const decodedTerm = Buffer.from(term, 'binary').toString('utf-8');
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        await recordSearch(decodedTerm);
        const posts = await searchPosts(decodedTerm, page, limit, userId);

        return res.status(StatusCodes.OK).json({
            message: `${decodedTerm} 검색 결과`, 
            data: posts
        });
    } catch (error) {
        console.error("검색 중 오류 발생:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 내부 오류" });
    }
};

// 검색 순위 핸들러
const handleGetSearchRankings = async (req, res) => {
    try {
        const rankings = await getSearchRankings();
        const topRankings = rankings.slice(0, 10); // 상위 10개만 선택
        return res.status(StatusCodes.OK).json({
            message: '검색 순위',
            data: topRankings
        });
    } catch (error) {
        console.error("검색 순위 조회 오류:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 내부 오류" });
    }
};

module.exports = {
    handleListMainPost,
    handleSearchPosts,
    handleGetSearchRankings
};
