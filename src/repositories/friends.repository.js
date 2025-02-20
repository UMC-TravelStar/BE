const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

class FriendsRepository{
    //친구 요청 존재 여부 확인
    async findFriendRequest(fromUserId, toUserId){
        return await prisma.friend.findFirst({
            where:{
                from_user_id: fromUserId,
                to_user_id: toUserId
            }
        })
    }

    //친구 요청 생성
    async createFriendRequest(fromUserId, toUserId, areWeFriend){
        return await prisma.friend.create({
            data:{
                from_user_id: fromUserId,
                to_user_id: toUserId,
                are_we_friend: areWeFriend  
            }
        })
    }

    // 특정 요청 찾기
    async findFriendRequestById(requestId){
        return await prisma.friend.findUnique({
            where: { request_id: parseInt(requestId) }
        });
    }

    // 친구 요청 업데이트(수락 처리)
    async updateFriendRequest(fromUserId, toUserId, areWeFriend){
        return await prisma.friend.updateMany({
            where: {
                from_user_id: fromUserId,
                to_user_id: toUserId
            },
            data: {
                are_we_friend: areWeFriend
            }
        });
    }

    // 내가 보낸 친구 요청 조회(아직 수락되지 않은 요청)
    async findSentFriendRequests(userId){
        return await prisma.friend.findMany({
            where: {from_user_id: userId, are_we_friend: false},
            select:{
                request_id: true,
                to_user_id: true,
                created_at: true,
                to_user: {
                    select: {
                        nickname: true,
                        u_image: true
                    }
                }
            }
        });
    }

    // 내게 온 친구 요청 조회(아직 수락하지 않은 요청)
    async findReceivedFriendRequests(userId){
        return await prisma.friend.findMany({
            where: {to_user_id: userId, are_we_friend: true},
            select:{
                request_id: true,
                from_user_id: true, 
                created_at: true,
                from_user: {
                    select: {
                        nickname: true,
                        u_image: true
                    }
                }
            }
        });
    }

    // 서로 친구인 목록 조회
    async findFriends(userId){
        return await prisma.friend.findMany({
            where: {
                are_we_friend: true,
                OR: [
                    {from_user_id: userId},
                    {to_user_id: userId}
                ]
            },
            select: {
                request_id: true,
                from_user_id: true,
                to_user_id: true,
                created_at: true,

                // 내가 from_user인 레코드라면 "to_user" 정보를 가져옴
                to_user: {
                    select: {
                        nickname: true,
                        u_image: true
                    }
                },

                // 내가 to_user인 레코드라면 "from_user" 정보를 가져옴
                from_user: {
                    select: {
                        nickname: true,
                        u_image: true
                    }
                }
            }
        });
    }

    // 친구 삭제
    async deleteFriend(fromUserId, toUserId){
        return await prisma.friend.updateMany({
            where:{
                OR: [
                    {from_user_id: fromUserId, to_user_id: toUserId},
                    {from_user_id: toUserId, to_user_id: fromUserId},
                ],
                are_we_friend: true,
            },
            data: {
                are_we_friend: false
            }
        })
    }

}

module.exports = new FriendsRepository();