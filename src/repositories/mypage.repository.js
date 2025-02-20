const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class MyPageRepository {
  // 유저 정보 조회
  async findUserById(userId) {
    return await prisma.user.findFirst({
      where: { user_id: userId },
      select: {
        user_id: true,
        nickname: true,
        password: true,
        name: true,
        birth: true,
        phonenum: true,
        email: true,
      },
    });
  }

  // 유저 정보 수정
  async updateUserById(userId, userData) {
    if (userData.birth && typeof userData.birth === "string") {
      userData.birth = new Date(`${userData.birth}T00:00:00.000Z`); // 변환
    }

    return await prisma.user.update({
      where: { user_id: userId },
      data: userData,
      select: {
        user_id: true,
        nickname: true,
        name: true,
        birth: true,
        phonenum: true,
        email: true,
      },
    });
  }

  // 보관 글 목록 조회
  async findStoragedPost(userId) {
    return await prisma.post.findMany({
      where: { user_id: userId, storage: 2 },
      select: {
        post_id: true,
        title: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  // 보관 글 상태 수정(보관->전체공개)
  async updateStoragePost(postId) {
    return await prisma.post.update({
      where: { post_id: postId },
      data: { storage: 0 },
      select: {
        post_id: true,
        updated_at: true,
      },
    });
  }

  // 프로필 이미지 등록/수정 - 원래 이미지가 있는지 확인
  async checkProfileImage(userId) {
    return prisma.user_image.findUnique({
      where: {
        user_id: userId,
      },
    });
  }

  // 프로필 이미지 등록/수정 - db에 데이터 생성
  async createImage(userId, fileUrl) {
    return prisma.user_image.create({
      data: {
        user_id: userId,
        file_name: fileUrl,
      },
    });
  }

  // 프로필 이미지 등록/수정 - db에 데이터 수정
  async updateImage(userId, fileUrl) {
    return prisma.user_image.update({
      where: {
        user_id: userId,
      },
      data: {
        file_name: fileUrl,
      },
    });
  }

  // 프로필 이미지 삭제 - 이미지 가져오기
  async findPostImages(userId) {
    return prisma.user_image.findUnique({
      where: {
        user_id: userId,
      },
      select: {
        file_name: true,
      },
    });
  }

  // 프로필 이미지 삭제 - 이미지 삭제
  async deleteImageDB(userId) {
    return prisma.user_image.delete({
      where: {
        user_id: userId,
      },
    });
  }
}
module.exports = new MyPageRepository();
