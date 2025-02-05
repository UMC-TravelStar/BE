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

class ScheduleDto {
  constructor(schedule) {
      this.schedule_id = schedule.schedule_id;
      this.location = schedule.location;
      this.date_time = schedule.date_time;
      this.created_at = schedule.created_at;
      this.updated_at = schedule.updated_at;
  }
}

module.exports = ScheduleDto;
