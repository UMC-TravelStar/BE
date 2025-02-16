const PlanetService = require('../services/planet.service');

// 행성 생성
const handleCreatePlanet = async (req, res) => {
    try{
        const userId = req.userId;
        const {planetName} = req.body;
        if(!planetName){
            return res.status(400).json({message: '행성 이름을 입력하세요.'});
        }

        const result = await PlanetService.createPlanet(userId, planetName);
        res.status(200).json({
            resultType: 'success',
            message: '행성 생성 완료',
            data: result
        });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

// 유저 행성 조회
const handleGetPlanet = async (req, res) => {
    try{
        const userId = req.userId;
        const result = await PlanetService.getPlanet(userId);
        res.status(200).json({
            resultType: 'success',
            message: '행성 조회 완료',
            data: result
        });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

// 행성 이름 변경
const handleUpdatePlanet = async (req, res) => {
    try{
        const userId = req.userId;
        const {planetName} = req.body;
        if(!planetName){
            return res.status(400).json({message: '행성 이름을 입력하세요.'});
        }

        const result = await PlanetService.updatePlanet(userId, planetName);
        res.status(200).json({
            resultType: 'success',
            message: '행성 이름 변경 완료',
            data: result
        });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

// 다른 유저의 행성 조회
const handleGetOtherPlanet = async (req, res) => {
    try{
        // console.log('다른 유저의 행성 조회');
        const planetId = req.params.planetId;
        const result = await PlanetService.getPlanet(planetId);
        res.status(200).json({
            resultType: 'success',
            message: '다른 유저의 행성 조회 완료',
            data: result
        });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    handleCreatePlanet,
    handleGetPlanet,
    handleUpdatePlanet,
    handleGetOtherPlanet,
};