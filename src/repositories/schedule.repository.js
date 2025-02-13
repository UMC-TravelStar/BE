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

    async getSchedulesByDate(userId, date) {
        return await prisma.schedule.findMany({
            where: {
                user_id: userId,
                date_time: {
                    gte: new Date(date.setHours(0, 0, 0, 0)),
                    lt: new Date(date.setHours(23, 59, 59, 999)),
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
