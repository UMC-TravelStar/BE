const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ScheduleRepository {
    // Day_schedule 관련 메서드
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

    async getDaySchedules(userId) {
        return await prisma.day_schedule.findMany({
            where: { user_id: userId },
        });
    }

    async getDayScheduleById(dayId) {
        return await prisma.day_schedule.findUnique({
            where: { day_id: dayId },
        });
    }

    async updateDaySchedule(dayId, title, content) {
        return await prisma.day_schedule.update({
            where: { day_id: dayId },
            data: { title, content },
        });
    }

    async deleteDaySchedule(dayId) {
        return await prisma.day_schedule.delete({
            where: { day_id: dayId },
        });
    }

    // Schedule 관련 메서드
    async createSchedule(dayId, userId, title, dateTime) {
        return await prisma.schedule.create({
            data: {
                day_id: dayId,
                user_id: userId,
                title,
                date_time: dateTime,
            },
        });
    }

    async getSchedules(dayId, userId) {
        return await prisma.schedule.findMany({
            where: { day_id: dayId, user_id: userId },
        });
    }

    async getSchedulesByDate(dayId, userId, startDate, endDate) {
        return await prisma.schedule.findMany({
            where: {
                day_id: dayId,
                user_id: userId,
                date_time: {
                    gte: startDate,
                    lt: endDate,
                },
            },
        });
    }

    async getScheduleById(scheduleId) {
        return await prisma.schedule.findUnique({
            where: { schedule_id: scheduleId },
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
