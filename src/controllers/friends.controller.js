const FriendsService = require('../services/friends.service');

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
    res.status(500).json({ message: error.message });
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
      res.status(500).json({ message: error.message });
  }
};

// 내가 친구 요청한 목록 조회
const handleGetSentFriendRequests = async (req, res) => {
  try{
    const userId = req.userId;
    const result = await FriendsService.getSentFriendRequests(userId);
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
    res.status(200).json({
      resultType: 'success',
      message: '서로 친구인 목록 조회 완료',
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
    console.log("params: ",req.params);

    const userId = req.userId;
    const {friendId} = req.params;
    const result = await FriendsService.deleteFriend(userId, friendId);
    res.status(200).json({
      resultType: 'success',
      message: '친구 삭제 완료',
      // data: result
    });
  } catch(error) {
      res.status(500).json({ message: error.message });
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