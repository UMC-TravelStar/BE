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
    
    // 날짜별 Day Schedule 조회
    async getDaySchedulesByDate(userId, date) {
        return await prisma.day_schedule.findMany({
            where: {
                user_id: userId,
                date: {
                    gte: new Date(date.setHours(0, 0, 0, 0)), // 시작 시간
                    lt: new Date(date.setHours(23, 59, 59, 999)) // 종료 시간
                }
            }
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

    // 날짜별 Schedule 조회
    async getSchedulesByDate(dayId, date) {
        return await prisma.schedule.findMany({
            where: {
                day_id: dayId,
                date_time: {
                    gte: new Date(date.setHours(0, 0, 0, 0)), // 시작 시간
                    lt: new Date(date.setHours(23, 59, 59, 999)) // 종료 시간
                }
            }
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
