// user.controller.js
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

// 회원가입 처리
const handleUserSignUp = async (req, res) => {
  const { user_id, nickname, password, name, birth, phonenum, email } =
    req.body;

  try {
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
};

// 로그인 처리
const handleUserLogin = (req, res) => {
  const { id, pw } = req.body;
  const secretKey = process.env.JWT_SECRET;

  if (!id || !pw) {
    return res.status(400).json({
      message: "아이디와 비밀번호를 입력해주세요.",
    });
  }

  // JWT 생성 (실제로는 DB에서 사용자 인증 필요)
  const token = jwt.sign({ id, pw }, secretKey, {
    expiresIn: "10h",
  });

  res.cookie("authToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    maxAge: 1000 * 60 * 60 * 10, // 10시간
  });

  res.status(200).json({
    message: "로그인 성공!",
    token,
  });
};

// 로그아웃 처리
const handleUserLogout = (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
  });

  res.status(200).json({
    message: "로그아웃 성공! 쿠키가 삭제되었습니다.",
  });
};

module.exports = {
  handleUserSignUp,
  handleUserLogin,
  handleUserLogout,
};
