const { request } = require('express');
const PlanetRepository = require('../repositories/planet.repository');

class PlanetService{
    //행성 생성
    async createPlanet(userId, planetName){
        const user = await PlanetRepository.findPlanetByUserId(userId);
        if(user){
            throw new Error('이미 행성이 존재합니다.');
        }

        const planet = await PlanetRepository.createPlanet(userId, planetName); 
        return {
            message: '행성 생성 완료',
            planet: {
                userId: planet.user_id,
                planetId: planet.planet_id,
                planetName: planet.name,
            }
        }

    };

    //유저 행성 조회
    async getPlanet(userId){
        const planet = await PlanetRepository.findPlanetByUserId(userId);
        if(!planet){
            throw new Error('행성이 존재하지 않습니다.');
        }

        return {
            message: '행성 조회 성공',
            planet: {
                userId: planet.user_id,
                planetId: planet.planet_id,
                planetName: planet.name,
            }
        }
    };

    //행성 이름 변경
    async updatePlanet(userId, planetName){
        const planet = await PlanetRepository.findPlanetByUserId(userId);
        if(!planet){
            throw new Error('행성이 존재하지 않습니다.');
        }

        const updatedPlanet = await PlanetRepository.updatePlanet(userId, planetName);
        return {
            message: '행성 이름 변경 완료',
            planet: {
                userId: updatedPlanet.user_id,
                planetName: updatedPlanet.name,
            }
        }
    };
};

module.exports = new PlanetService();