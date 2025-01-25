// user.controller.js
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const nodemailer = require("nodemailer");
require("dotenv").config();

// 1. 이메일 인증
const handleEmailCertification = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "이메일 주소를 입력해주세요." });
  }

  try {
    // 인증 코드 생성 (6자리 숫자)
    const authCode = Math.random().toString().substr(2, 6);

    // 이메일 발송 설정
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ri711628@gmail.com",
        pass: "awvlmtlnjnvbkubs",
      },
    });

    //인증 이메일 전송
    await transporter.sendMail({
      from: `"여행별" <${process.env.NODEMAILER_USER}>`,
      to: email,
      subject: "여행별 입니다!",
      html: `<p>아래 인증번호를 입력 해주세요:</p>
             <h3>${authCode}</h3>`,
    });

    // 프론트엔드에 인증 코드 전달
    res.status(200).json({
      message: "인증 이메일이 발송되었습니다.",
      authCode, // 프론트에서 사용할 인증 코드
    });
  } catch (error) {
    console.error("이메일 발송 오류:", error);
    res.status(500).json({ message: "이메일 발송 실패", error: error.message });
  }
};

// 2. 회원가입 처리
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
const handleUserLogin = async (req, res) => {
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

//아이디 찾기
const handleFindUserIdByEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "이메일 주소를 입력해주세요.",
    });
  }

  try {
    // 이메일로 사용자 조회
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "해당 이메일로 등록된 사용자가 없습니다.",
      });
    }

    // 유저 ID 반환
    res.status(200).json({
      message: "아이디 찾기 성공",
      user_id: user.user_id, // user.user_id로 접근 가능
    });
  } catch (error) {
    console.error("아이디 찾기 오류:", error);
    res.status(500).json({
      message: "아이디 찾기 실패",
      error: error.message,
    });
  }
};

const handleresetPassword = async (req, res) => {
  const { user_id, email, newPassword, confirmPassword } = req.body;

  if (!user_id || !email || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "모든 필드를 입력해주세요.",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
    });
  }

  try {
    // 사용자 확인
    const user = await prisma.user.findUnique({
      where: { user_id },
    });

    if (!user || user.user_id.toString() !== user_id) {
      return res.status(404).json({
        message: "아이디와 이메일이 일치하는 사용자가 없습니다.",
      });
    }

    // 비밀번호 업데이트
    await prisma.user.update({
      where: { user_id },
      data: { password: newPassword }, // 암호화 없이 저장
    });

    res.status(200).json({
      message: "비밀번호가 성공적으로 변경되었습니다.",
    });
  } catch (error) {
    console.error("비밀번호 재설정 오류:", error);
    res.status(500).json({
      message: "비밀번호 재설정 실패",
      error: error.message,
    });
  }
};

module.exports = {
  handleEmailCertification,
  handleUserSignUp,
  handleUserLogin,
  handleUserLogout,
  handleFindUserIdByEmail,
  handleresetPassword,
};
