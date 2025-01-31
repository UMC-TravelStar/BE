const { listUserPosts, searchPosts, recordSearch, getSearchRankings } = require("../services/mainpage.service.js");
const { StatusCodes } = require("http-status-codes");

const handleListMainPost = async (req, res) => {
  const userId = req.params.user_id; 
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
      const postData = await listUserPosts(userId, page, limit, userId); 
      return res.status(StatusCodes.OK).json({
          message: '포스트 조회 성공',
          data: postData
      });
  } catch (error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 내부 오류" });
  }
};

const handleSearchPosts = async (req, res) => {
  const userId = req.params.user_id;

  try {
      const { term } = req.query;

      if (!term) {
          return res.status(StatusCodes.BAD_REQUEST).json({ message: "검색어가 필요합니다." });
      }

      const decodedTerm = Buffer.from(term, 'binary').toString('utf-8');
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      await recordSearch(decodedTerm, userId); // 검색어 기록
      const posts = await searchPosts(decodedTerm, page, limit, userId);

      return res.status(StatusCodes.OK).json({
          message: '검색 결과',
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
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 내부 오류" });
    }
};

module.exports = {
    handleListMainPost,
    handleSearchPosts,
    handleGetSearchRankings
};
