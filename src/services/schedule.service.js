const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ScheduleRepository {
  async createSchedule(userId, location, dateTime) {
    return await prisma.schedule.create({
      data: {
        user: {
          connect: {
            user_id: userId,
          },
        },
        location,
        date_time: dateTime,
      },
    });
  }

  // 전체 일정 조회 (날짜 필터 없이)
  async getAllSchedules(userId) {
    return await prisma.schedule.findMany({
      where: { user_id: userId },
    });
  }

  // 특정 날짜에 해당하는 일정 조회
  async getSchedulesByDate(userId, date) {
    // date는 이미 Date 객체여야 합니다.
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await prisma.schedule.findMany({
      where: {
        user_id: userId,
        date_time: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });
  }

  async getScheduleById(scheduleId) {
    return await prisma.schedule.findUnique({
      where: { schedule_id: scheduleId },
    });
  }

  async updateSchedule(scheduleId, location, dateTime) {
    return await prisma.schedule.update({
      where: { schedule_id: scheduleId },
      data: { location, date_time: dateTime },
    });
  }

  async deleteSchedule(scheduleId) {
    return await prisma.schedule.delete({
      where: { schedule_id: scheduleId },
    });
  }
}

module.exports = new ScheduleRepository();
