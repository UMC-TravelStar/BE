// repositories/schedule.repository.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ScheduleRepository {
    async createSchedule(userId, title, dateTime) {
        return await prisma.schedule.create({
            data: {
                user_id: userId,
                title,
                date_time: dateTime,
            },
        });
    }

    async getSchedules(userId) {
        return await prisma.schedule.findMany({
            where: { user_id: userId },
        });
    }

    async getSchedulesByDate(userId, startDate, endDate) {
      return await prisma.schedule.findMany({
          where: {
              user_id: userId,
              date_time: {
                  gte: startDate, // 시작 날짜
                  lt: endDate, // 종료 날짜 (다음 날)
              },
          },
      });
  }

    async updateSchedule(scheduleId, title, dateTime) {
        return await prisma.schedule.update({
            where: { schedule_id: scheduleId },
            data: { title, date_time: dateTime },
        });
    }

    async deleteSchedule(scheduleId) {
        return await prisma.schedule.delete({
            where: { schedule_id: scheduleId },
        });
    }
}

module.exports = new ScheduleRepository();
