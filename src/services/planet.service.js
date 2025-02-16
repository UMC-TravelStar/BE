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
        return planet;

    };

    //유저 행성 조회
    async getPlanet(planetId){
        const planet = await PlanetRepository.findPlanetByUserId(planetId);
        if(!planet){
            throw new Error('행성이 존재하지 않습니다.');
        }

        return planet;
    };

    //행성 이름 변경
    async updatePlanet(userId, planetName){
        const planet = await PlanetRepository.findPlanetByUserId(userId);
        if(!planet){
            throw new Error('행성이 존재하지 않습니다.');
        }

        const updatedPlanet = await PlanetRepository.updatePlanet(userId, planetName);
        return planet;
    };
};

module.exports = new PlanetService();