const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

class MyPageRepository {
    // 유저 정보 조회
    async findUserById(userId){
        return await prisma.user.findFirst({
            where: {user_id: userId},
            select: {
                user_id: true,
                nickname: true,
                password: true,
                name: true,
                birth: true,
                phonenum: true,
                email: true,
            }
        })
    };

    // 유저 정보 수정
    async updateUserById(userId, userData){
        return await prisma.user.update({
            where: {user_id: userId},
            data: userData,
            select: {
                user_id: true,
                nickname: true,
                name: true,
                birth: true,
                phonenum: true,
                email: true,
            }
        })
    };

    // 보관 글 목록 조회
    async findStoragedPost(userId){
        return await prisma.post.findMany({
            where: {user_id: userId, storage: 2},
            select: {
                post_id: true,
                title: true,
                created_at: true,
                updated_at: true,
            }
        })
    };

    // 보관 글 상태 수정(보관->전체공개)
    async updateStoragePost(postId){
        return await prisma.post.update({
            where: {post_id: postId},
            data: {storage: 0},
            select: {
                post_id: true,
                updated_at: true,
            }
        })
    }
};
module.exports = new MyPageRepository();