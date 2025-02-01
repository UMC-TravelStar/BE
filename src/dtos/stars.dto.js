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

module.exports = { extractUserIdFromToken };
