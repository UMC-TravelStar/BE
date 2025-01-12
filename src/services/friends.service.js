const FriendsRepository = require('../repositories/friends.repository');

class FriendsService{
    //친구 요청
    async sendFriendRequest(fromUserId, toUserId){
        //이미 요청이 있는 지 확인
        const existingRequest = await FriendsRepository.findFriendRequest(fromUserId, toUserId);
        if(existingRequest){
            throw new Error('이미 친구 요청을 보냈습니다.');
        }

        //양방향 관계 생성
        await FriendsRepository.createFriendRequest(fromUserId, toUserId, true);
        await FriendsRepository.createFriendRequest(toUserId, fromUserId, false);
    }
}

module.exports = new FriendsService();