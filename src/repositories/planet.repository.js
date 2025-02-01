const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

class PlanetRepository{
    // 유저 아이디로 행성 찾기
    async findPlanetByUserId(userId){
        return prisma.Planet.findFirst({
            where: {user_id: userId}
        })
    }

    //행성 생성
    async createPlanet(userId, planetName){
        return prisma.Planet.create({
            data:{
                user_id: userId,
                name: planetName,
            }
        })
    }

    //행성 이름 변경
    async updatePlanet(userId, planetName){
        return prisma.Planet.update({
            where: {user_id: userId},
            data: {name: planetName}
        })
    }
};
module.exports = new PlanetRepository();