// user.controller.js
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const nodemailer = require("nodemailer");
const StatusCodes = require("http-status-codes");
require("dotenv").config();

// 1. 이메일 인증
const handleEmailCertification = async (req, res) => {
  console.log("이메일 인증을 요청 했습니다");

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
    // 트랜잭션 사용으로 데이터 일관성 유지
    const newUser = await prisma.$transaction(async (prisma) => {
      // 1. 사용자 데이터 생성
      const createdUser = await prisma.user.create({
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

      // 2. stars 테이블에 초기 값 설정
      await prisma.stars.create({
        data: {
          user_id: createdUser.user_id,
          name: "0", // 초기 이름 설정 => 이름을 설정하지 않았으면 string "0"임
          views: 0, // 초기 조회수
          vote_num: 0, // 초기 투표 수
          created_at: new Date(), // 현재 시간으로 설정
          updated_at: new Date(), // 현재 시간으로 설정
        },
      });

      return createdUser;
    });

    // 성공 응답
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

const handleCheckUserId = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({
      message: "아이디를 입력해주세요.",
    });
  }

  try {
    // 아이디로 사용자 조회
    const user = await prisma.user.findUnique({
      where: { user_id },
    });

    if (user) {
      return res.status(200).json({
        message: "이미 사용 중인 아이디입니다.",
        isDuplicate: true, // 아이디 중복 여부
      });
    }

    // 중복 아이디가 없을 경우
    res.status(200).json({
      message: "사용 가능한 아이디입니다.",
      isDuplicate: false,
    });
  } catch (error) {
    console.error("아이디 중복 확인 오류:", error);
    res.status(500).json({
      message: "아이디 중복 확인 실패",
      error: error.message,
    });
  }
};

//로그인 처리
const handleUserLogin = async (req, res) => {
  const { id, pw } = req.body;
  const secretKey = process.env.JWT_SECRET;

  if (!id || !pw) {
    return res.status(400).json({
      message: "아이디와 비밀번호를 입력해주세요.",
    });
  }

  try {
    // 데이터베이스에서 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { user_id: id },
    });

    if (!user) {
      return res.status(404).json({
        message: "해당 아이디를 가진 사용자가 없습니다.",
      });
    }

    // 비밀번호 확인 (평문 비교)
    if (pw !== user.password) {
      return res.status(401).json({
        message: "비밀번호가 일치하지 않습니다.",
      });
    }

    // JWT 토큰 생성
    const token = jwt.sign({ id: user.user_id }, secretKey, {
      expiresIn: "10h",
    });

    res.status(200).json({
      message: "로그인 성공!",
      token, // 프론트엔드에서 저장할 수 있도록 응답으로 보냄
    });
  } catch (error) {
    console.error("로그인 처리 중 오류:", error);
    res.status(500).json({
      message: "서버 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

// 로그아웃 처리
const handleUserLogout = (req, res) => {
  res.status(200).json({
    message: "로그아웃 성공! 클라이언트에서 토큰을 삭제하세요.",
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
    // // 1. 요청 헤더에서 JWT 토큰 추출
    // const authHeader = req.headers.authorization;

    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //   return res.status(401).json({ message: "로그인이 필요합니다." });
    // }

    // const token = authHeader.split(" ")[1]; // "Bearer <TOKEN>" 형식에서 토큰 부분만 추출

    // // 2. 토큰 디코딩하여 user_id 추출
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded Token:", decoded);
    // const userId = decoded.id;

    const userId = req.userId; // 헤더에서 userId 추출 (모니 수정)

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
    // const userId = req.params.user_id;

    // if (!userId) {
    //   return res.status(400).json({ message: "사용자 ID가 필요합니다." });
    // }

    // // 2. 요청 헤더에서 토큰 추출
    // const authHeader = req.headers.authorization;

    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //   return res.status(401).json({ message: "로그인이 필요합니다." });
    // }

    // const token = authHeader.split(" ")[1]; // "Bearer <TOKEN>"에서 TOKEN만 추출

    // // 3. 토큰 디코딩 및 유효성 확인
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded Token:", decoded);

    // if (decoded.id !== userId) {
    //   return res.status(403).json({ message: "권한이 없습니다." });
    // }

    const userId = req.userId; // 헤더에서 userId 추출 (모니 수정)

    if (!userId) {
      return res.status(400).json({ message: "유효하지 않은 토큰입니다." });
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
    // const userId = req.params.user_id; // URL에서 user_id 추출
    const userId = req.userId; // 헤더에서 userId 추출 (모니 수정)

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

const handleDeleteUser = async (req, res) => {
  try {
    const userId = req.userId; // JWT 미들웨어에서 저장한 userId 사용
    console.log("🚀 회원 탈퇴 요청:", userId);

    // 🔹 회원 존재 여부 확인
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 🔹 트랜잭션을 사용하여 FK 제약 조건 해결 후 삭제
    await prisma.$transaction(async (prismaTx) => {
      console.log("🚀 트랜잭션 시작");

      // ✅ FK를 참조하는 모든 테이블의 데이터 먼저 삭제
      // ✅ post_image 먼저 삭제 후 post 삭제
      await prismaTx.post_image.deleteMany({
        where: { post: { user_id: userId } },
      });

      await prismaTx.post.deleteMany({ where: { user_id: userId } });

      await prismaTx.friend.deleteMany({
        where: {
          OR: [{ from_user_id: userId }, { to_user_id: userId }],
        },
      });

      await prismaTx.votes.deleteMany({ where: { user_id: userId } });
      await prismaTx.stars.deleteMany({ where: { user_id: userId } });
      await prismaTx.subscrition.deleteMany({ where: { user_id: userId } });
      await prismaTx.user_image.deleteMany({ where: { user_id: userId } });
      await prismaTx.user_bgimage.deleteMany({ where: { user_id: userId } });
      await prismaTx.planet.deleteMany({ where: { user_id: userId } });
      await prismaTx.schedule.deleteMany({ where: { user_id: userId } });

      // ✅ 최종적으로 사용자 삭제
      await prismaTx.user.delete({
        where: { user_id: userId },
      });

      console.log("✅ 회원 탈퇴 성공");
    });

    res.status(StatusCodes.OK).json({ message: "회원 탈퇴 성공" });
  } catch (error) {
    console.error("❌ 회원 탈퇴 오류:", error);

    if (error.code === "P2003") {
      return res.status(StatusCodes.CONFLICT).json({
        message: "외래 키 제약 조건으로 인해 회원 탈퇴가 실패했습니다.",
        error: error.message,
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "서버 오류가 발생했습니다.",
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
  handleCheckUserId,
  setPlanetName,
  updatePlanetName,
  getPlanetName,
  handleDeleteUser,
};
