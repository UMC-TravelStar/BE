const { request } = require('express');
const MyPageRepository = require('../repositories/mypage.repository');

const MyPageService = {
    // 유저 정보 조회
    async findUserById(userId){
        const user = await MyPageRepository.findUserById(userId);
        if(!user){
            throw new Error('유저 정보가 없습니다.');
        }

        return user;
    },
};
module.exports = new MyPageService();