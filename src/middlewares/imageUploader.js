const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const createUUID = require("./uuid.js");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    },
});

// 확장자 검사 목록
const allowedExtensions = [".png", ".jpg", ".jpeg", ".bmp", ".gif"];

// 📌 업로드 폴더를 설정할 수 있도록 변경 (다중 파일 지원)
const getImageUploader = (uploadPath) => {
  return multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, callback) => {
        const extension = path.extname(file.originalname);
        const uuid = createUUID();

        if (!allowedExtensions.includes(extension)) {
          return callback(new Error("Unsupported file type"));
        }

        callback(null, `${uploadPath}/${uuid}${extension}`);
      },
      acl: "public-read-write",
    }),
    limits: { fileSize: 200 * 1024 * 1024 }, 
  });
};

module.exports = getImageUploader;
