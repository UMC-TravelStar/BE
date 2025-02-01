const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const MyPageRepository = {
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
                planet_name: true,
            }
        })
    },
};
module.exports = new MyPageRepository();