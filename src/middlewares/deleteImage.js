const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    },
});

/**
 * ✅ S3에서 특정 폴더 내 이미지 삭제 함수
 * @param {string} folderPath - S3의 폴더 경로 (예: "posts/")
 * @param {string[]} imageUrls - 삭제할 이미지들의 URL 배열
 */
const deleteImage = async (folderPath, imageUrls) => {
    if (!imageUrls.length) return;

    const deletePromises = imageUrls.map(async (imageUrl) => {
        const fileName = imageUrl.split("/").pop(); // 이미지 파일명 추출
        const key = `${folderPath}/${fileName}`; // S3에서 삭제할 객체 키 설정

        try {
            await s3.send(new DeleteObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: key,
            }));
            console.log(`✅ S3에서 삭제 완료: ${key}`);
        } catch (error) {
            console.error(`❌ S3 삭제 실패: ${key}`, error);
        }
    });

    await Promise.all(deletePromises); // 모든 삭제 요청 병렬 처리
};

module.exports = { deleteImage };