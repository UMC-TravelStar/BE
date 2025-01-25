const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ScheduleRepository {
    // Day_schedule 생성
    async createDaySchedule(userId, date, title, content) {
        return await prisma.day_schedule.create({
            data: {
                user_id: userId,
                date: date,
                title: title,
                content: content,
            },
        });
    }

    // Day_schedule 조회
    async getDaySchedules(userId) {
        return await prisma.day_schedule.findMany({
            where: { user_id: userId },
        });
    }

    // Day_schedule 수정
    async updateDaySchedule(dayId, title, content) {
        return await prisma.day_schedule.update({
            where: { day_id: dayId },
            data: { title, content },
        });
    }

    // Day_schedule 삭제
    async deleteDaySchedule(dayId) {
        return await prisma.day_schedule.delete({
            where: { day_id: dayId },
        });
    }

    // Schedule 생성
    async createSchedule(dayId, userId, location, dateTime) {
        return await prisma.schedule.create({
            data: {
                day_id: dayId,
                location: location,
                date_time: dateTime,
            },
        });
    }

    // Schedule 조회
    async getSchedules(dayId) {
        return await prisma.schedule.findMany({
            where: { day_id: dayId },
        });
    }

    // Schedule 수정
    async updateSchedule(scheduleId, location, dateTime) {
        return await prisma.schedule.update({
            where: { schedule_id: scheduleId },
            data: { location, date_time: dateTime },
        });
    }

    // Schedule 삭제
    async deleteSchedule(scheduleId) {
        return await prisma.schedule.delete({
            where: { schedule_id: scheduleId },
        });
    }
}

module.exports = new ScheduleRepository();
