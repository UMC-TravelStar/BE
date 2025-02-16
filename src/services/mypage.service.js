const { request } = require('express');
const MyPageRepository = require('../repositories/mypage.repository');
const { deleteImage } = require("../middlewares/deleteImage.js");

class MyPageService {
    // 유저 정보 조회
    async findUserById(userId){
        const user = await MyPageRepository.findUserById(userId);
        if(!user){
            throw new Error('유저 정보가 없습니다.');
        }

        return user;
    };

    // 유저 정보 수정
    async updateUserById(userId, userData){
        const user = await MyPageRepository.updateUserById(userId, userData);
        if(!user){
            throw new Error('유저 정보 수정에 실패했습니다.');
        }

        return user;
    };

    // 보관 글 목록 조회
    async findStoragedPost(userId){
        const posts = await MyPageRepository.findStoragedPost(userId);
        if(!posts || posts.length === 0){
            throw new Error('보관 글 목록 조회에 실패했습니다.');
        }

        return posts;
    };

    // 보관 글 상태 수정(보관->전체공개)
    async updateStoragePost(postId){
        const post = await MyPageRepository.updateStoragePost(postId);
        if(!post){
            throw new Error('보관 글 상태 수정에 실패했습니다.');
        }

        return post;
    };

    // 프로필 이미지 등록/수정
    async registerProfileImage(userId, fileUrl) {
        // 1. 원래 프로필 이미지가 있는지 확인
        const checkImage = await MyPageRepository.checkProfileImage(userId);

        // 2. 이미지가 없다면 생성 / 있다면 데이터 바꾸기
        let image;

        if (!checkImage) {
            image = await MyPageRepository.createImage(userId, fileUrl);
        }
        else {
            image = await MyPageRepository.updateImage(userId, fileUrl);

            await deleteImage("profile-image", [checkImage.file_name]);
        }

        return image.file_name;
    };
};
module.exports = new MyPageService();