const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
require("dotenv").config();
const {
  handleEmailCertification,
  handleUserSignUp,
  handleUserLogin,
  handleUserLogout,
} = require("./controllers/user.controller.js");
const ScheduleController = require("./controllers/schedule.controller"); 
const server_ip = process.env.IP;
const { handleAddPost, 
        handleGetUserPost,
        handleEditPost, 
} = require("./controllers/post.controller.js");

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
        url: `${server_ip}`, // 요청 URL
      },
    ],
  },
  apis: ["./src/index.js", "./src/controllers/*.js"], // Swagger 파일 경로
};

const specs = swaggerJsDoc(options);

app.listen(port, () => {
  console.log(`포트가 4000인 서버 실행`);
});

app.use(
  cors({
    origin: "*", //origin: "https://travelstar.netlify.app", // HTTPS를 사용하는 프론트엔드 도메인
    credentials: true, // 쿠키를 포함한 요청 허용
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 폼 데이터를 파싱하기 위해 존재함.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

//유저관리
app.post("/email", handleEmailCertification);

app.post("/register", handleUserSignUp);

app.post("/login", handleUserLogin);

app.get("/logout", handleUserLogout);

//일지 작성
app.post('/api/v1/users/:userId/posts', handleAddPost);

//일지 조회
app.get('/api/v1/users/:userId/posts/:postsId', handleGetUserPost);

//일지 수정
app.patch('/api/v1/users/:userId/posts/:postsId', handleEditPost);

// 일정 관리 API
app.post("/api/users/:user_id/schedules", ScheduleController.addSchedule); // 일정 추가
app.get("/api/users/:user_id/schedules", ScheduleController.getSchedules); // 일정 조회
app.patch("/api/users/:user_id/schedules/:schedule_id", ScheduleController.updateSchedule); // 일정 수정
app.delete("/api/users/:user_id/schedules/:schedule_id", ScheduleController.deleteSchedule); // 일정 삭제

// 로그인 API
/**
 * @swagger
 * prod/login:
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
 * prod/register:
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

// 이메일 중복 확인 API
/**
 * @swagger
 * /register/email-check:
 *   get:
 *     summary: 이메일 중복 확인
 *     description: 사용자가 입력한 이메일이 이미 등록되어 있는지 확인합니다.
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: 확인할 이메일 주소
 *     responses:
 *       200:
 *         description: 이메일 중복 확인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이메일 사용 가능"
 *                 available:
 *                   type: boolean
 *                   example: true
 *       409:
 *         description: 이메일이 이미 등록되어 있음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이미 사용 중인 이메일입니다."
 */


// 유저의 일지 조회 API
/**
 * @swagger
 * /users/{user_id}/posts:
 *   get:
 *     summary: 유저의 일지 조회
 *     description: 로그인된 사용자의 일지을 조회합니다. 최신순으로 10개씩 반환합니다.
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
 *         description: 일지 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "일지 조회 성공"
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
 *         description: 일지이 없어요. 작성해주세요!
 */

// 메인 페이지 API
/**
 * @swagger
 * /users/{user_id}/main:
 *   get:
 *     summary: 메인 페이지 (추천 일지 조회)
 *     description: 조회수 순으로 추천 일지를 10개씩 반환합니다.
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
 *         description: 추천 일지 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "추천 일지 조회 성공"
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
 *                           description: 일지에 첨부된 이미지 파일 이름 (post_image 테이블의 file_name)
 *       404:
 *         description: 일지가가 없어요. 작성해주세요!
 */

//검색 API
/**
 * @swagger
 * /users/{user_id}/posts/search:
 *   get:
 *     summary: 일지 검색
 *     description: 키워드를 기반으로 사용자의 일지를 검색합니다.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: "로그인된 사용자 ID"
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: 검색할 키워드
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: "페이지 번호 (기본값: 1)"
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *         description: "한 페이지에 표시할 일지 수 (기본값: 10)"
 *     responses:
 *       200:
 *         description: 일지 검색 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "일지 검색 성공"
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
 *         description: 검색 결과가 없음
 */

// 일지 작성 API
/**
 * @swagger
 * /users/{user_id}/post:
 *   post:
 *     summary: 일지 작성
 *     description: 로그인된 사용자가 일지를를 작성합니다.
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
 *                 description: 일지 제목
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
 *         description: 일지 작성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "일지 작성 성공"
 *                 post_id:
 *                   type: integer
 *                   description: 작성된 일지의 ID
 *       400:
 *         description: 일지 작성 실패
 */

// 일지 조회 API
/**
 * @swagger
 * /users/{user_id}/posts/{post_id}:
 *   get:
 *     summary: 일지 조회
 *     description: 사용자가 작성한 일지을 조회합니다.
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
 *         description: 일지 ID
 *     responses:
 *       200:
 *         description: 일지 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "일지 조회 성공"
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
 *         description: 일지을 찾을 수 없음
 */

// 일지 수정 API
/**
 * @swagger
 * /users/{user_id}/posts/{post_id}:
 *   patch:
 *     summary: 일지 수정
 *     description: 사용자가 작성한 일지를 수정합니다.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: "로그인된 사용자 ID"
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "수정할 일지의 ID"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: "새로운 일지 제목"
 *               content:
 *                 type: string
 *                 description: "수정된 일지 내용"
 *     responses:
 *       200:
 *         description: 일지 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "일지 수정 성공"
 *       400:
 *         description: 수정 실패 (잘못된 입력 등)
 *       404:
 *         description: 일지를 찾을 수 없음
 */

// 일지 삭제 API
/**
 * @swagger
 * /users/{user_id}/posts/{post_id}:
 *   delete:
 *     summary: 일지 삭제
 *     description: 사용자가 작성한 일지를 삭제합니다.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: "로그인된 사용자 ID"
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "삭제할 일지의 ID"
 *     responses:
 *       200:
 *         description: 일지 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "일지 삭제 성공"
 *       404:
 *         description: 일지를 찾을 수 없음
 *       403:
 *         description: 접근 권한 없음
 */

//행성 설정 API
/**
 * @swagger
 * /users/{user_id}/planets:
 *   post:
 *     summary: 행성 설정
 *     description: 사용자가 자신의 행성 설정합니다.
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
 *         description: 행성 설정 성공
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
 *         description: 행성 설정 실패
 */

// 행성 수정 API
/**
 * @swagger
 * /users/{user_id}/planets:
 *   patch:
 *     summary: 행성 수정
 *     description: 사용자가 자신의 행성을 수정합니다.
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
 *                 description: "수정된 행성 이름"
 *     responses:
 *       200:
 *         description: 행성 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "행성 수정 성공"
 *                 planet:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: 행성 수정 실패
 *       404:
 *         description: 행성을 찾을 수 없음
 */


// 다른 사용자의 행성 조회 API
/**
 * @swagger
 * /users/{user_id}/planets/{target_user_id}:
 *   get:
 *     summary: 다른 사용자의 행성 조회
 *     description: 특정 사용자의 행성을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: "로그인된 사용자 ID"
 *       - in: path
 *         name: target_user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: "조회할 사용자의 ID"
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
 *                 planet:
 *                   type: object
 *                   properties:
 *                     planet_id:
 *                       type: integer
 *                     name:
 *                       type: string
 *       404:
 *         description: 사용자를 찾을 수 없음
 *       403:
 *         description: 접근 권한 없음
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
 *                         description: "친구의 프로필 사진 (user_image 테이블의 file_name)"
 *       404:
 *         description: 친구가 존재하지 않음
 */
