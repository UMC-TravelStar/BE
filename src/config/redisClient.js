require("dotenv").config();
const redis = require("redis");

const redisClient = redis.createClient({
  url: "redis://travelstar.hdn1sy.ng.0001.apn2.cache.amazonaws.com:6379",
});

redisClient.on("connect", () => {
  console.log("✅ Redis 연결 성공!");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis 연결 오류:", err);
});

// 명시적으로 연결 초기화
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("❌ Redis 연결 실패:", error);
  }
})();

module.exports = redisClient;

// require("dotenv").config();
// const redis = require("redis");

// const redisClient = redis.createClient({
//   url: "redis://travelstar.hdn1sy.ng.0001.apn2.cache.amazonaws.com:6379",
//   legacyMode: true, // 기존 콜백 방식과 호환
// });

// redisClient.on("connect", () => {
//   console.log("✅ Redis 연결 성공!");
// });

// redisClient.on("error", (err) => {
//   console.error("❌ Redis 연결 오류:", err);
// });

// // 명시적으로 연결 초기화
// (async () => {
//   try {
//     await redisClient.connect();
//   } catch (error) {
//     console.error("❌ Redis 연결 실패:", error);
//   }
// })();

// module.exports = redisClient;
// // const redisClient = redis.createClient({
// //   url: "redis://travelstar.hdn1sy.ng.0001.apn2.cache.amazonaws.com:6379", // AWS Elasticache Redis 주소
// // });
