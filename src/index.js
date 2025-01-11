const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
require("dotenv").config();
const {
  handleUserSignUp,
  handleUserLogin,
  handleUserLogout,
} = require("./controllers/user.controller.js");
const sever_ip = process.env.IP;

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "API 문서",
      description: "Node.js Swagger documentation using swagger-jsdoc",
    },
    servers: [
      {
        url: `${sever_ip}`, // 요청 URL
      },
    ],
  },
  apis: ["./index.js"], // Swagger 파일 경로
};

const specs = swaggerJsDoc(options);

app.listen(port, () => {
  console.log(`포트가 4000인 서버 실행`);
});

app.use(
  cors({
    origin: "https://travelstar.netlify.app", // HTTPS를 사용하는 프론트엔드 도메인
    credentials: true, // 쿠키를 포함한 요청 허용
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 폼 데이터를 파싱하기 위해 존재함.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

//유저관리
app.post("/register", handleUserSignUp);
app.post("/login", handleUserLogin);
app.get("/logout", handleUserLogout);

// 로그인 API
/**
 * @swagger
 * /login:
 *   post:
 *     summary: 로그인
 *     description: 사용자가 로그인합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: 사용자 ID
 *               pw:
 *                 type: string
 *                 description: 비밀번호
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: 로그인 실패
 */

// 회원가입 API
/**
 * @swagger
 * /register:
 *   post:
 *     summary: 회원가입
 *     description: 사용자를 등록합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: 사용자 ID
 *               nickname:
 *                 type: string
 *                 description: 사용자 닉네임
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *               name:
 *                 type: string
 *                 description: 이름
 *               birth:
 *                 type: string
 *                 format: date
 *                 description: 생년월일
 *               phonenum:
 *                 type: string
 *                 description: 전화번호
 *               email:
 *                 type: string
 *                 description: 이메일 주소
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                     nickname:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: 회원가입 실패
 */

//행성 이름 설정 API
/**
 * @swagger
 * /users/{user_id}/planet_set:
 *   post:
 *     summary: 행성 이름 설정
 *     description: 사용자가 자신의 행성 이름을 설정합니다.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: "사용자 ID (로그인된 사용자)"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 행성 이름
 *     responses:
 *       200:
 *         description: 행성 이름 설정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 planet:
 *                   type: object
 *                   properties:
 *                     planet_id:
 *                       type: integer
 *                     user_id:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: 행성 이름 설정 실패
 */

// 유저의 게시글 조회 API
/**
 * @swagger
 * /users/{user_id}/posts:
 *   get:
 *     summary: 유저의 게시글 조회
 *     description: 로그인된 사용자의 게시글을 조회합니다. 최신순으로 10개씩 반환합니다.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: "사용자 ID (로그인된 사용자)"
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: "페이지 번호 (기본값: 1)"
 *     responses:
 *       200:
 *         description: 게시글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시글 조회 성공"
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       post_id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: 게시글이 없어요. 작성해주세요!
 */

// 메인 페이지 API
/**
 * @swagger
 * /users/{user_id}/main:
 *   get:
 *     summary: 추천 게시글 조회
 *     description: 조회수 순으로 추천 게시글을 10개씩 반환합니다.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 ID (로그인된 사용자)
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: "페이지 번호 (기본값: 1)"
 *     responses:
 *       200:
 *         description: 추천 게시글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "추천 게시글 조회 성공"
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       post_id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       views:
 *                         type: integer
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                           description: 게시글에 첨부된 이미지 파일 이름 (post_image 테이블의 file_name)
 *       404:
 *         description: 게시글이 없어요. 작성해주세요!
 */

// 게시글 작성 API
/**
 * @swagger
 * /users/{user_id}/post:
 *   post:
 *     summary: 게시글 작성
 *     description: 로그인된 사용자가 게시글을 작성합니다.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: "사용자 ID (로그인된 사용자)"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 게시글 제목
 *               location:
 *                 type: string
 *                 description: 위치
 *               music:
 *                 type: string
 *                 description: "음악 (선택 사항)"
 *               content:
 *                 type: string
 *                 description: 본문 내용
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: 사진 파일 이름
 *               feeling:
 *                 type: string
 *                 description: 이번 여행을 통해 느낀 감정
 *     responses:
 *       201:
 *         description: 게시글 작성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시글 작성 성공"
 *                 post_id:
 *                   type: integer
 *                   description: 작성된 게시글의 ID
 *       400:
 *         description: 게시글 작성 실패
 */

// 게시글 조회 API
/**
 * @swagger
 * /users/{user_id}/posts/{post_id}:
 *   get:
 *     summary: 게시글 조회
 *     description: 사용자가 작성한 게시글을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: "사용자 ID (로그인된 사용자)"
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시글 ID
 *     responses:
 *       200:
 *         description: 게시글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시글 조회 성공"
 *                 post:
 *                   type: object
 *                   properties:
 *                     post_id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     location:
 *                       type: string
 *                     music:
 *                       type: string
 *                     content:
 *                       type: string
 *                     photos:
 *                       type: array
 *                       items:
 *                         type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: 게시글을 찾을 수 없음
 */

// 행성 조회 API
/**
 * @swagger
 * /users/{user_id}/planets:
 *   get:
 *     summary: 행성 조회
 *     description: 로그인된 사용자의 행성을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: "사용자 ID (로그인된 사용자)"
 *     responses:
 *       200:
 *         description: 행성 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "행성 조회 성공"
 *                 planets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       planet_id:
 *                         type: integer
 *                       name:
 *                         type: string
 */

/**
 * @swagger
 * /users/{user_id}/stars/ranking:
 *   get:
 *     summary: 별자리 랭킹 조회
 *     description: 조회수 순으로 별자리 랭킹을 반환합니다.
 *     responses:
 *       200:
 *         description: 별자리 랭킹 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "별자리 랭킹 조회 성공"
 *                 rankings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       star_id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       views:
 *                         type: integer
 *       404:
 *         description: 별자리 데이터가 없습니다.
 */

// 마이페이지 조회 API
/**
 * @swagger
 * /users/{user_id}/my_page:
 *   get:
 *     summary: 사용자 마이페이지 조회
 *     description: 로그인된 사용자의 마이페이지 정보를 조회합니다.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 ID (로그인된 사용자)
 *     responses:
 *       200:
 *         description: 마이페이지 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "마이페이지 조회 성공"
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                     nickname:
 *                       type: string
 *                     password:
 *                       type: string
 *                       example: "******"  # 비밀번호는 마스킹 처리
 *                     name:
 *                       type: string
 *                     birth:
 *                       type: string
 *                       format: date
 *                     phonenum:
 *                       type: string
 *                     email:
 *                       type: string
 *                     profile_image:
 *                       type: string
 *                       description: "사용자 프로필 사진 (user_image 테이블의 file_name)"
 *                     planet_name:
 *                       type: string
 *                       description: 사용자의 행성 이름
 */

// 마이페이지 수정 API
/**
 * @swagger
 * /users/{user_id}/my_page/edit:
 *   patch:
 *     summary: 사용자 마이페이지 수정
 *     description: 로그인된 사용자의 마이페이지 정보를 수정합니다.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 ID (로그인된 사용자)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *                 description: 새로운 닉네임
 *               email:
 *                 type: string
 *                 description: 새로운 이메일 주소
 *     responses:
 *       200:
 *         description: 마이페이지 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "마이페이지 수정 성공"
 *       400:
 *         description: 수정 실패 (잘못된 입력 등)
 */

// 사용자의 친구 목록 조회 API
/**
 * @swagger
 * /users/{user_id}/friends:
 *   get:
 *     summary: 친구 목록 조회
 *     description: 로그인된 사용자의 친구 목록을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 ID (로그인된 사용자)
 *     responses:
 *       200:
 *         description: 친구 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "친구 목록 조회 성공"
 *                 friends:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       friend_id:
 *                         type: string
 *                         description: 친구의 사용자 ID
 *                       friend_name:
 *                         type: string
 *                         description: 친구의 이름
 *                       profile_image:
 *                         type: string
 *                         description: 친구의 프로필 사진 (user_image 테이블의 file_name)
 *       404:
 *         description: 친구기 존재하지 않음
 */
