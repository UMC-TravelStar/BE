// services/schedule.service.js
const ScheduleRepository = require("../repositories/schedule.repository");

class ScheduleService {
    async createSchedule(userId, title, dateTime) {
        return await ScheduleRepository.createSchedule(userId, title, dateTime);
    }

    async getSchedules(userId) {
        return await ScheduleRepository.getSchedules(userId);
    }

    async updateSchedule(scheduleId, title, dateTime) {
        return await ScheduleRepository.updateSchedule(scheduleId, title, dateTime);
    }

    async deleteSchedule(scheduleId) {
        return await ScheduleRepository.deleteSchedule(scheduleId);
    }
}

module.exports = new ScheduleService();
