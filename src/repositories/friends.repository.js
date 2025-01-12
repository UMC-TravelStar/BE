const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

class FriendsRepository{
    //친구 요청 존재 여부 확인
    async findFriendRequest(fromUserId, toUserId){
        return prisma.Friend.findFirst({
            where:{
                from_user_id: fromUserId,
                to_user_id: toUserId  
            }
        })
    }

    //친구 요청 생성
    async createFriendRequest(fromUserId, toUserId, areWeFriend){
        return prisma.Friend.create({
            data:{
                from_user_id: fromUserId,
                to_user_id: toUserId,
                are_we_friend: areWeFriend  
            }
        })
    }
}

module.exports = new FriendsRepository();