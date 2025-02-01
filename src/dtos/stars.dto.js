const jwt = require("jsonwebtoken");

const extractUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id; // user_id 반환
  } catch (error) {
    console.error("JWT 디코딩 오류:", error);
    return null;
  }
};
const validateUserId = (params) => {
  const { user_id } = params;

  if (!user_id) {
    throw new Error("user_id는 필수입니다.");
  }

  const parsedUserId = parseInt(user_id, 10);
  if (isNaN(parsedUserId)) {
    throw new Error("user_id는 숫자여야 합니다.");
  }

  return { user_id: parsedUserId };
};

module.exports = { extractUserIdFromToken, validateUserId };
