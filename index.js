const express = require("express");
const { PrismaClient } = require("@prisma/client");
const app = express();
const port = 4000;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();
require("dotenv").config();

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

//회원가입
app.post("/register", async (req, res) => {
  const { user_id, nickname, password, name, birth, phonenum, email } =
    req.body;

  try {
    // Prisma를 통해 사용자 생성 (비밀번호 평문으로 저장)
    const newUser = await prisma.user.create({
      data: {
        user_id, // Primary Key
        nickname: nickname || null,
        password, // 암호화 없이 저장
        name: name || null,
        birth: birth ? new Date(birth) : null, // Date로 변환
        phonenum: phonenum || null,
        email: email || null,
      },
    });

    res.status(201).json({
      message: "회원가입 성공",
      user: {
        user_id: newUser.user_id,
        nickname: newUser.nickname,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("회원가입 에러:", error);
    res.status(400).json({
      message: "회원가입 실패",
      error: error.message,
    });
  }
});

//로그인
app.post("/login", (req, res) => {
  const { id, pw } = req.body;

  // 환경 변수에서 시크릿 키 가져오기
  const secretKey = process.env.JWT_SECRET;

  // JWT 토큰 생성
  const token = jwt.sign({ id, pw }, secretKey, {
    expiresIn: "10h", // 토큰 만료 시간 설정 (10시간)
  });

  console.log(token);

  // 쿠키에 JWT 저장
  res.cookie("authToken", token, {
    httpOnly: true, // JavaScript에서 쿠키 접근 금지 (보안 강화)
    secure: true, // HTTPS 환경에서만 전송 (로컬 개발에서는 false)
    sameSite: "Lax", // CSRF 방지 (SameSite 정책)
    maxAge: 1000 * 60 * 60 * 10, // 10시간 (밀리초 단위)
  });

  // 응답
  res.status(200).json({
    message: "로그인 성공!",
    token, // 생성된 토큰 반환
  });
});

//로그아웃
app.get("/logout", (req, res) => {
  // authToken 쿠키 삭제
  res.clearCookie("authToken", {
    httpOnly: true, // 쿠키 속성 설정 (로그인과 동일한 설정 유지)
    secure: true, // HTTPS 환경에서만 작동 (로컬 개발에서는 false)
    sameSite: "Lax", // CSRF 방지 정책
    path: "/", // 경로
  });

  console.log("로그아웃 성공!");

  // 응답
  res.status(200).json({
    message: "로그아웃 성공! 쿠키가 삭제되었습니다.",
  });
});
