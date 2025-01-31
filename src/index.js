const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const {
  handleEmailCertification,
  handleUserSignUp,
  handleUserLogin,
  handleUserLogout,
  handleFindUserIdByEmail,
  handleresetPassword,
  setPlanetName,
  updatePlanetName,
  getPlanetName,
} = require("./controllers/user.controller.js");
const ScheduleController = require("./controllers/schedule.controller");
const server_ip = process.env.IP;
const {
  handleAddPost,
  handleListUserPost,
  handleGetUserPost,
  handleEditPost,
  handleDeletePost,
} = require("./controllers/post.controller.js");
const {
  handleAddDaySchedule,
  handleGetDaySchedules,
  handleGetDaySchedulesByDateInUrl,
  handleUpdateDaySchedule,
  handleDeleteDaySchedule,
  handleAddSchedule,
  handleGetSchedules,
  handleGetSchedulesByDateInUrl,
  handleUpdateSchedule,
  handleDeleteSchedule,
} = require("./controllers/schedule.controller.js");
const {
  handleListMainPost,
  handleSearchPosts,
  handleGetSearchRankings
} = require("./controllers/mainpage.controller.js");

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

//app.use(
//  cors({
//    origin: "*", //origin: "https://travelstar.netlify.app", // HTTPS를 사용하는 프론트엔드 도메인
//    credentials: true, // 쿠키를 포함한 요청 허용
//  })
//);
const corsOptions = {
  origin: ["http://localhost:5173", "https://travelstar.netlify.app"], // 허용할 도메인 리스트
  credentials: true, // 쿠키 및 세션 정보를 포함
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 허용할 메서드
  allowedHeaders: ["Content-Type", "Authorization"], // 허용할 요청 헤더
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 폼 데이터를 파싱하기 위해 존재함.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

app.set("json spaces", 2);

//유저관리
app.post("/email", handleEmailCertification);

app.post("/register", handleUserSignUp);

app.post("/login", handleUserLogin);

app.post("/logout", handleUserLogout);

app.post("/find-id", handleFindUserIdByEmail);

app.post("/reset-pw", handleresetPassword);

//행성
app.post("/planet", setPlanetName);
app.get("/planet/:user_id", getPlanetName);
app.patch("/planet/:user_id", updatePlanetName);

// 일지
app.post("/users/:userId/posts", handleAddPost); // 일지 작성
app.get("/users/:userId/posts", handleListUserPost); // 유저의 일지 조회(전체)
app.get("/users/:userId/posts/:postsId", handleGetUserPost); // 유저의 일지 조회(1개)
app.patch("/users/:userId/posts/:postsId", handleEditPost); // 일지 수정
app.delete("/users/:userId/posts/:postsId", handleDeletePost); // 일지 삭제

// 하루 일정 작성
app.post("/prod/users/:user_id/day-schedules", handleAddDaySchedule); // Day Schedule 추가
app.get("/prod/users/:user_id/day-schedules", handleGetDaySchedules); // Day Schedule 조회
app.get(
  "/prod/users/:user_id/day-schedules/:date",
  handleGetDaySchedulesByDateInUrl
); // 날짜별 Day Schedule 조회
app.patch(
  "/prod/users/:user_id/day-schedules/:day_id",
  handleUpdateDaySchedule
); // Day Schedule 수정
app.delete(
  "/prod/users/:user_id/day-schedules/:day_id",
  handleDeleteDaySchedule
); // Day Schedule 삭제

// 일정 작성
app.post(
  "/prod/users/:user_id/day-schedules/:day_id/schedules",
  handleAddSchedule
); // Schedule 추가
app.get(
  "/prod/users/:user_id/day-schedules/:day_id/schedules",
  handleGetSchedules
); // Schedule 조회
app.get(
  "/prod/users/:user_id/day-schedules/:day_id/schedules/:date",
  handleGetSchedulesByDateInUrl
); // 날짜별 Schedule 조회
app.patch(
  "/prod/users/:user_id/day-schedules/:day_id/schedules/:schedule_id",
  handleUpdateSchedule
); // Schedule 수정
app.delete(
  "/prod/users/:user_id/day-schedules/:day_id/schedules/:schedule_id",
  handleDeleteSchedule
); // Schedule 삭제


// 메인 페이지
app.get("/prod/users/:user_id/home", handleListMainPost); // 메인페이지의 일지조회
app.get("/prod/users/:user_id/home/search", handleSearchPosts); // 메인 페이지에서 검색
app.get("/prod/users/:user_id/home/search/rankings", handleGetSearchRankings); // 검색 순위 조회


app.listen(port, () => {
  console.log(`포트가 4000인 서버 실행`);
});

// 로그인 API
/**
 * @swagger
 * /prod/login:
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
 * /prod/register:
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

/**
 * @swagger
 * /prod/email:
 *   post:
 *     summary: 이메일 인증번호 발송
 *     description: 사용자가 입력한 이메일로 인증번호를 발송하고 인증 코드를 응답합니다. 이후 사용자의 입력이 적절한지 확인하는 로직을 수행합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 인증 코드를 받을 이메일 주소
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: 인증 이메일 발송 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증 이메일이 발송되었습니다."
 *                 authCode:
 *                   type: string
 *                   example: "123456"
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이메일 주소를 입력해주세요."
 *       500:
 *         description: 서버 오류로 인해 이메일 발송 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이메일 발송 실패"
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /prod/reset-pw:
 *   post:
 *     summary: 비밀번호 재설정
 *     description: 아이디와 이메일을 사용하여 비밀번호를 새로 설정합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: 유저의 아이디
 *                 example: "123"
 *               email:
 *                 type: string
 *                 description: 유저의 이메일 주소
 *                 example: "user@example.com"
 *               newPassword:
 *                 type: string
 *                 description: 새 비밀번호
 *                 example: "newPassword123"
 *               confirmPassword:
 *                 type: string
 *                 description: 새 비밀번호 확인
 *                 example: "newPassword123"
 *     responses:
 *       200:
 *         description: 비밀번호 재설정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "비밀번호가 성공적으로 변경되었습니다."
 *       400:
 *         description: 잘못된 요청 - 필수 필드 누락 또는 비밀번호 불일치
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다."
 *       404:
 *         description: 아이디와 이메일이 일치하는 사용자가 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "아이디와 이메일이 일치하는 사용자가 없습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "비밀번호 재설정 실패"
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /prod/find-id:
 *   post:
 *     summary: 이메일로 유저 ID 찾기
 *     description: 사용자가 입력한 이메일로 등록된 유저의 ID를 반환합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 유저 ID를 찾을 이메일 주소
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: 유저 ID 찾기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "아이디 찾기 성공"
 *                 user_id:
 *                   type: integer
 *                   example: 123
 *       400:
 *         description: 잘못된 요청 - 이메일 미입력
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이메일 주소를 입력해주세요."
 *       404:
 *         description: 해당 이메일로 등록된 사용자가 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "해당 이메일로 등록된 사용자가 없습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "아이디 찾기 실패"
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
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
 *           type: string   # 여기를 수정했습니다.
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
 *         description: 일지가 없어요. 작성해주세요!
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
 * /prod/users/{userId}/posts:
 *   post:
 *     summary: 일지 작성
 *     description: 로그인된 사용자가 일지를 작성합니다.
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               region:
 *                 type: string
 *                 description: 위치 (지역)
 *               music:
 *                 type: string
 *                 description: "음악 (선택 사항)"
 *               content:
 *                 type: string
 *                 description: 본문 내용
 *               feeling:
 *                 type: string
 *                 description: 이번 여행을 통해 느낀 감정
 *               storage:
 *                 type: integer
 *                 description: 저장 공간 여부
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     post_id:
 *                       type: integer
 *                       description: 작성된 일지의 ID
 *                     title:
 *                       type: string
 *                       description: 일지 제목
 *                     content:
 *                       type: string
 *                       description: 본문 내용
 *                     music:
 *                       type: string
 *                       description: 음악
 *                     feeling:
 *                       type: string
 *                       description: 감정
 *                     storage:
 *                       type: integer
 *                       description: 저장 공간 여부
 *                     created_at:
 *                       type: string
 *                       description: 일지 생성 시간
 *                     updated_at:
 *                       type: string
 *                       description: 일지 업데이트 시간
 *                     user_id:
 *                       type: string
 *                       description: 사용자 ID
 *                     star_id:
 *                       type: integer
 *                       description: 별자리 ID
 *       400:
 *         description: 일지 작성 실패
 */

// 유저의 일지 조회(전체) API
/**
 * @swagger
 * /prod/users/{userId}/posts:
 *   get:
 *     summary: 유저의 일지 조회(전체)
 *     description: 로그인된 사용자의 일지를 조회합니다. 최신순으로 10개씩 반환합니다.
 *     parameters:
 *       - in: path
 *         name: userId
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       star:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           region:
 *                             type: string
 *             example:
 *               message: "일지 조회 성공"
 *               data:
 *                 - id: 17
 *                   title: "post1"
 *                   createdAt: "2025-01-25T18:53:48.928Z"
 *                   star:
 *                     id: 16
 *                     region: "여수2"
 *                 - id: 18
 *                   title: "post1"
 *                   createdAt: "2025-01-25T18:53:49.508Z"
 *                   star:
 *                     id: 16
 *                     region: "여수2"
 *                 - id: 19
 *                   title: "post1"
 *                   createdAt: "2025-01-25T18:53:49.988Z"
 *                   star:
 *                     id: 16
 *                     region: "여수2"
 *                 - id: 20
 *                   title: "post1"
 *                   createdAt: "2025-01-25T18:53:50.428Z"
 *                   star:
 *                     id: 16
 *                     region: "여수2"
 *       404:
 *         description: 일지가 없어요. 작성해주세요!
 */

// 유저의 일지 조회(1개) API
/**
 * @swagger
 * /prod/users/{userId}/posts/{postsId}:
 *   get:
 *     summary: 유저의 일지 조회(1개)
 *     description: 사용자가 작성한 일지를 조회합니다.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: "사용자 ID (로그인된 사용자)"
 *       - in: path
 *         name: postsId
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
 *                     region:
 *                       type: string
 *                       description: 위치 (지역)
 *                     title:
 *                       type: string
 *                       description: 일지 제목
 *                     content:
 *                       type: string
 *                       description: 본문 내용
 *                     music:
 *                       type: string
 *                       description: 음악
 *                     feeling:
 *                       type: string
 *                       description: 감정
 *                     storage:
 *                       type: integer
 *                       description: 저장 공간 여부
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       description: 일지 생성 시간
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       description: 일지 업데이트 시간
 *       404:
 *         description: 일지를 찾을 수 없음
 *       400:
 *         description: 파라미터 누락 또는 잘못된 요청
 *       500:
 *         description: 서버 내부 오류
 */

// 일지 수정 API
/**
 * @swagger
 * /prod/users/{userId}/posts/{postsId}:
 *   patch:
 *     summary: 일지 수정
 *     description: 사용자가 작성한 일지를 수정합니다.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: "로그인된 사용자 ID"
 *       - in: path
 *         name: postsId
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
 *               region:
 *                 type: string
 *                 description: "수정된 지역 정보"
 *               music:
 *                 type: string
 *                 description: "새로운 음악 링크"
 *               feeling:
 *                 type: string
 *                 description: "수정된 감정"
 *               storage:
 *                 type: integer
 *                 description: "스토리지 여부 (0 또는 1)"
 *     responses:
 *       200:
 *         description: 일지 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "일지 수정 성공"
 *                 postId:
 *                   type: object
 *                   properties:
 *                     post_id:
 *                       type: integer
 *                       example: 31
 *                     title:
 *                       type: string
 *                       example: "수정된 제목"
 *                     content:
 *                       type: string
 *                       example: "수정된 내용입니다."
 *                     music:
 *                       type: string
 *                       example: "새로운 음악 링크"
 *                     feeling:
 *                       type: string
 *                       example: "행복"
 *                     feel_color:
 *                       type: string
 *                       nullable: true
 *                     views:
 *                       type: integer
 *                       example: 8
 *                     storage:
 *                       type: integer
 *                       example: 0
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-31T14:53:09.466Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-31T16:42:51.980Z"
 *                     user_id:
 *                       type: string
 *                       example: "1"
 *                     star_id:
 *                       type: integer
 *                       example: 19
 *       400:
 *         description: 파라미터 누락 또는 잘못된 요청
 *       404:
 *         description: 일지를 찾을 수 없음
 *       500:
 *         description: 서버 내부 오류
 */


// 일지 삭제 API
/**
 * @swagger
 * /prod/users/{userId}/posts/{postsId}:
 *   delete:
 *     summary: 일지 삭제
 *     description: 사용자가 작성한 일지를 삭제합니다.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: "로그인된 사용자 ID"
 *       - in: path
 *         name: postsId
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
 *       400:
 *         description: 파라미터 누락 또는 잘못된 요청
 *       404:
 *         description: 일지를 찾을 수 없음
 *       500:
 *         description: 서버 내부 오류
 */

// 행성 설정 API
/**
 * @swagger
 * /prod/planet:
 *   post:
 *     summary: 행성 설정
 *     description: 사용자가 자신의 행성을 설정합니다. JWT 토큰을 통해 사용자 인증을 진행합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 설정할 행성 이름
 *                 example: "Earth"
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
 *                   example: "행성 이름이 성공적으로 업데이트되었습니다."
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       example: "1234"
 *                     planet_name:
 *                       type: string
 *                       example: "Earth"
 *       400:
 *         description: 요청 본문에 행성 이름이 없거나 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "행성 이름이 필요합니다."
 *       401:
 *         description: 유효하지 않은 토큰이거나 인증되지 않은 사용자
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그인이 필요합니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 오류가 발생했습니다."
 */

// 행성 수정 API
/**
 * @swagger
 * /prod/planet/{user_id}:
 *   patch:
 *     summary: "행성 수정"
 *     description: "사용자가 자신의 행성을 수정합니다."
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
 *                 example: "My New Planet"
 *     responses:
 *       200:
 *         description: "행성 수정 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "행성 이름이 성공적으로 수정되었습니다."
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       example: "12345"
 *                     planet_name:
 *                       type: string
 *                       example: "My New Planet"
 *       400:
 *         description: "요청이 잘못됨 (예: 행성 이름 누락)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "행성 이름이 필요합니다."
 *       401:
 *         description: "인증 실패 (토큰 없음 또는 유효하지 않음)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그인이 필요합니다."
 *       403:
 *         description: "권한 없음 (user_id가 일치하지 않음)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "권한이 없습니다."
 *       404:
 *         description: "사용자 또는 행성을 찾을 수 없음"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "행성을 찾을 수 없습니다."
 *       500:
 *         description: "서버 오류"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 오류가 발생했습니다."
 */

// 행성 조회 API
/**
 * @swagger
 * /prod/planet/{user_id}:
 *   get:
 *     summary: 행성 이름 조회
 *     description: 사용자의 행성이 있는지 조회합니다.
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
 *                 planet_name:
 *                   type: string
 *                   example: "지구"  # 예시 행성 이름
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "사용자 ID가 필요합니다."
 *       404:
 *         description: 행성을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "행성을 찾을 수 없습니다."
 *       500:
 *         description: 서버 오류 발생
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 오류가 발생했습니다."
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