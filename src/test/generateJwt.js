const jwt = require('jsonwebtoken');

const payload = { id: "moni" }; // JWT에 포함할 데이터 (id: "moni")
const secretKey = "your_secret_key"; // 실제 프로젝트에서는 process.env.JWT_SECRET 사용

const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

console.log("Generated JWT:", token);
