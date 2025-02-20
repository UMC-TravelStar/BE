const FriendsService = require('../services/friends.service');
const FriendsRepository = require('../repositories/friends.repository');

// 친구 요청
const handleSendFriendRequest = async (req, res) => {
  try{
    const fromUserId = req.userId;
    const {toUserId} = req.params;
    const result = await FriendsService.sendFriendRequest(fromUserId, toUserId);
    res.status(200).json({
      resultType: 'success',
      message: '친구 요청 완료',
      data: result
    });
} catch(error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      resultType: 'error',
      message: error.message
    })
}
};

// 친구 요청 수락
const handleAcceptFriendRequest = async (req, res) => {
  try{
    const {requestId} = req.params;
    const result = await FriendsService.acceptFriendRequest(requestId);
    res.status(200).json({
      resultType: 'success',
      message: '친구 요청 수락 완료',
      data: result
    });
  } catch(error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        resultType: 'error',
        message: error.message
      })
  }
};

// 내가 친구 요청한 목록 조회
const handleGetSentFriendRequests = async (req, res) => {
  try{
    const userId = req.userId;
    const result = await FriendsService.getSentFriendRequests(userId);

    if(result.length === 0){
      return res.status(200).json({
        resultType: 'empty',
        message: '아직 친구 요청을 보낸 사람이 없습니다. 친구 요청을 보내보세요!',
        data:[]
      });
    }

    res.status(200).json({
      resultType: 'success',
      message: '내가 친구 요청한 목록 조회 완료',
      data: result
    });
  } catch(error) {
      res.status(500).json({ message: error.message });
  }
};

// 나에게 친구 요청한 목록 조회
const handleGetReceivedFriendRequests = async (req, res) => {
  try{
    const userId = req.userId;
    const result = await FriendsService.getReceivedFriendRequests(userId);

    if(result.length === 0){
      return res.status(200).json({
        resultType: 'empty',
        message: '아직 친구 요청을 받은 사람이 없습니다.',
        data:[]
      });
    }

    res.status(200).json({
      resultType: 'success',
      message: '나에게 친구 요청한 목록 조회 완료',
      data: result
    });
  } catch(error) {
      res.status(500).json({ message: error.message });
  }
};

// 서로 친구인 목록 조회
const handleGetFriendsList = async (req, res) => {
  try{
    const userId = req.userId;
    const result = await FriendsService.getFriendsList(userId);  
    console.log('friends list result: ', result);

    if(result.length === 0){
      return res.status(200).json({
        resultType: 'empty',
        message: '현재 친구가 없습니다. 새로운 친구 관계를 형성해주세요.',
        data:[]
      });
    }

    res.status(200).json({
      resultType: 'success',
      message: '서로 친구 상태인 목록 조회 완료',
      data: result
    });
  } catch(error) {
      res.status(500).json({ message: error.message });
  }
};

// 친구 삭제
const handleDeleteFriend = async (req, res) => {
  try{
    console.log('친구 삭제');
    // console.log("params: ",req.params);

    const {requestId} = req.params;
    const friendRequest = await FriendsRepository.findFriendRequestById(requestId);
    if(!friendRequest) {
      return res.status(404).json({
        resultType: 'error',
        message: '해당 친구 요청을 찾을 수 없습니다.'
      })
    }

    const {from_user_id, to_user_id} = friendRequest;
    const result = await FriendsService.deleteFriend(from_user_id, to_user_id);
    res.status(200).json({
      resultType: 'success',
      message: '친구 삭제 완료',
      // data: result
    });
  } catch(error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        resultType: 'error',
        message: error.message
      })
  }
};

module.exports = {
  handleSendFriendRequest,
  handleAcceptFriendRequest,
  handleGetSentFriendRequests,
  handleGetReceivedFriendRequests,
  handleGetFriendsList,
  handleDeleteFriend
}