const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

class PlanetRepository{
    // planetId로 행성 찾기
    async findPlanetByUserId(userId){
        return await prisma.user.findUnique({
            where: {user_id: userId},
            select: {
                planet_name: true
            }
        })
    }

    //행성 생성
    async createPlanet(userId, planetName){
        return await prisma.planet.create({
            data:{
                user_id: userId,
                name: planetName,
            }
        })
    }

    //행성 이름 변경
    async updatePlanet(userId, planetName){
        return await prisma.planet.update({
            where: {user_id: userId},
            data: {name: planetName}
        })
    }
};
module.exports = new PlanetRepository();