const { request } = require('express');
const FriendsRepository = require('../repositories/friends.repository');

class FriendsService{
    //친구 요청
    async sendFriendRequest(fromUserId, toUserId){
        //이미 요청이 있는 지 확인
        const existingRequest = await FriendsRepository.findFriendRequest(fromUserId, toUserId);
        if(existingRequest){
            const error = new Error('이미 친구 요청을 보냈습니다.');
            error.statusCode = 409;
            throw error;
        }

        //양방향 관계 생성
        const createdRequestFromUser = await FriendsRepository.createFriendRequest(fromUserId, toUserId, true);
        const ceratedReqeustToUser = await FriendsRepository.createFriendRequest(toUserId, fromUserId, false);
    
        return {createdRequestFromUser, ceratedReqeustToUser};
    }

    //친구 요청 수락
    async acceptFriendRequest(requestId){
        //요청이 존재하는지 확인
        const friendRequest = await FriendsRepository.findFriendRequestById(requestId);
        if(!friendRequest){
            const error = new Error('친구 요청이 존재하지 않습니다.');
            error.statusCode = 404;
            throw error;
        }

        //친구 요청 수락하여 양방향 관계 설정
        const createdReqeustFromUser = await FriendsRepository.updateFriendRequest(friendRequest.from_user_id, friendRequest.to_user_id, true);
        const createdReqeustToUser = await FriendsRepository.updateFriendRequest(friendRequest.to_user_id, friendRequest.from_user_id, true);
        
        return {createdReqeustFromUser, createdReqeustToUser};
    }

    //내가 친구 요청한 목록 조회
    async getSentFriendRequests(userId){
        const sentRequests =  await FriendsRepository.findSentFriendRequests(userId);

        return sentRequests.map((request) => {
            return {
                requestId: request.request_id,
                toUserNickname: request.to_user.nickname,
                toUserImage: request.to_user.u_image,
                requestedAt: request.created_at
            }
        });
    }

    //나에게 친구 요청한 목록 조회
    async getReceivedFriendRequests(userId){
        const receivedRequests = await FriendsRepository.findReceivedFriendRequests(userId);

        return receivedRequests.map((request) => {
            return {
                requestId: request.request_id,
                fromUserNickname: request.from_user.nickname,
                fromUserImage: request.from_user.u_image,
                requestedAt: request.created_at
            }
        });
    }

    //서로 친구인 목록 조회
    async getFriendsList(userId){
        const friends = await FriendsRepository.findFriends(userId);

        const fullyAcceptedPromises = friends.map(async (friend) => {
            const {from_user_id, to_user_id} = friend;
            const reversedRecord = await FriendsRepository.findFriendRequest(to_user_id, from_user_id);
            if(reversedRecord && reversedRecord.are_we_friend){
                return friend;
            }
            return null;
        })
        const fullyAcceptedFriends = (await Promise.all(fullyAcceptedPromises)).filter(Boolean);

        // return fullyAcceptedFriends.map((friend) => {
        //     // 현재 유저가 from_user_id인 경우 => 친구 정보는 friend.to_user
        //     // 현재 유저가 to_user_id인 경우 => 친구 정보는 friend.from_user
        //     const isIAmFrom = friend.from_user_id === userId;
        //     const friendInfo = isIAmFrom ? friend.to_user : friend.from_user;

        //     return {
        //         requestId: friend.request_id,
        //         friendNickname: friendInfo.nickname,
        //         friendImage: friendInfo.u_image,
        //         requestedAt: friend.created_at
        //     }
        // });
        return fullyAcceptedFriends
    .filter((friend) => friend.request_id % 2 !== 0) // 홀수인 경우만 필터링
    .map((friend) => {
        const isIAmFrom = friend.from_user_id === userId;
        const friendInfo = isIAmFrom ? friend.to_user : friend.from_user;

        return {
            requestId: friend.request_id,
            friendNickname: friendInfo.nickname,
            friendImage: friendInfo.u_image,
            requestedAt: friend.created_at
        };
    });
    }

    //친구 삭제
    async deleteFriend(fromUserId, toUserId){
        //친구 관계가 있는지 확인
        const existingAtoB = await FriendsRepository.findFriendRequest(fromUserId, toUserId);
        const existingBtoA = await FriendsRepository.findFriendRequest(toUserId, fromUserId);

        if(
            (!existingAtoB || !existingAtoB.are_we_friend) ||
            (!existingBtoA || !existingBtoA.are_we_friend)
        ) {
            const error = new Error('친구 관계가 존재하지 않습니다.');
            error.statusCode = 404;
            throw error;
        }

        // 양방향 레코드를 are_we_friend = false로 업데이트
        await FriendsRepository.deleteFriend(fromUserId, toUserId);

        return {
            message: '친구 관계가 해제되었습니다.'
        }
    }

    async deleteRequest(requestId, toId) {
        const check = await FriendsRepository.checkRequest(requestId, toId);

        if (!check) {
            console.log("Request not found.");
            return null;
        }

        await FriendsRepository.deleteRequest(requestId, toId, check.from_user_id);

        return {
            message: "친구 요청이 거절되었습니다."
        }
    }
}

module.exports = new FriendsService();