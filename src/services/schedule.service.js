const ScheduleRepository = require("../repositories/schedule.repository");

class ScheduleService {
    async createSchedule(userId, location, dateTime) {
        return await ScheduleRepository.createSchedule(userId, location, dateTime);
    }

    async getSchedulesByDate(userId, date) {
        return await ScheduleRepository.getSchedulesByDate(userId, date);
    }

    async getScheduleById(scheduleId) {
        return await ScheduleRepository.getScheduleById(scheduleId);
    }

    async updateSchedule(scheduleId, location, dateTime) {
        return await ScheduleRepository.updateSchedule(scheduleId, location, dateTime);
    }

    async deleteSchedule(scheduleId) {
        return await ScheduleRepository.deleteSchedule(scheduleId);
    }
}

module.exports = new ScheduleService();
