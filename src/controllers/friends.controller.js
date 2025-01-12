const FriendService = require('../services/friends.service');

class FriendsController {
  // 친구 요청 기능
  async sendFriendRequest(req, res) {
    try{
        console.log('친구 요청');
        console.log("body: ",req.body);

        const { fromUserId, toUserId } = req.body;
        const result = await FriendService.sendFriendRequest(fromUserId, toUserId);
        res.status(200).json(result);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new FriendsController();