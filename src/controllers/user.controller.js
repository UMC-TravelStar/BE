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
    secure: false, //둘다 설정은 false
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

//행성 설정
const setPlanetName = async (req, res) => {
  try {
    // 1. 쿠키에서 토큰 추출
    const token = req.cookies.authToken; // 쿠키에 저장된 토큰
    if (!token) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    // 2. 토큰 디코딩하여 user_id 추출
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT_SECRET은 환경 변수로 설정
    console.log("Decoded Token:", decoded);
    const userId = decoded.id;

    if (!userId) {
      return res.status(400).json({ message: "유효하지 않은 토큰입니다." });
    }

    // 3. 요청 바디에서 행성 이름 추출
    const planetName = req.body.name;

    if (!planetName) {
      return res.status(400).json({ message: "행성 이름이 필요합니다." });
    }

    // 4. 데이터베이스에서 user_id로 사용자 정보 업데이트
    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: { planet_name: planetName },
    });

    // 5. 응답 반환
    res.status(200).json({
      message: "행성 이름이 성공적으로 업데이트되었습니다.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

const updatePlanetName = async (req, res) => {
  try {
    // 1. 경로 파라미터에서 user_id 추출
    const userId = req.params.user_id;

    if (!userId) {
      return res.status(400).json({ message: "사용자 ID가 필요합니다." });
    }

    // 2. 요청 헤더에서 토큰 추출
    const token = req.cookies.authToken; // 쿠키에서 인증 토큰 추출
    if (!token) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    // 3. 토큰 디코딩 및 유효성 확인
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    if (decoded.id !== userId) {
      return res.status(403).json({ message: "권한이 없습니다." });
    }

    // 4. 요청 바디에서 행성 이름 추출
    const { name: planetName } = req.body;

    if (!planetName) {
      return res.status(400).json({ message: "행성 이름이 필요합니다." });
    }

    // 5. 데이터베이스에서 user_id로 사용자 정보 업데이트
    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: { planet_name: planetName },
    });

    // 6. 응답 반환
    res.status(200).json({
      message: "행성 이름이 성공적으로 수정되었습니다.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("행성 수정 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

const getPlanetName = async (req, res) => {
  try {
    const userId = req.params.user_id; // URL에서 user_id 추출
    if (!userId) {
      return res.status(400).json({ message: "사용자 ID가 필요합니다." });
    }

    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { planet_name: true },
    });

    if (!user || !user.planet_name) {
      return res.status(404).json({ message: "행성을 찾을 수 없습니다." });
    }

    res.status(200).json({
      message: "행성 조회 성공",
      planet_name: user.planet_name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

module.exports = {
  handleEmailCertification,
  handleUserSignUp,
  handleUserLogin,
  handleUserLogout,
  handleFindUserIdByEmail,
  handleresetPassword,
  setPlanetName,
  updatePlanetName,
  getPlanetName,
};
