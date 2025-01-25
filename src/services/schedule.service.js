const ScheduleRepository = require("../repositories/schedule.repository");

class ScheduleService {
    // Day_schedule 관련 메서드
    async createDaySchedule(userId, date, title, content) {
        return await ScheduleRepository.createDaySchedule(userId, date, title, content);
    }

    async getDaySchedules(userId) {
        return await ScheduleRepository.getDaySchedules(userId);
    }

    async getDayScheduleById(dayId) {
        return await ScheduleRepository.getDayScheduleById(dayId);
    }

    async updateDaySchedule(dayId, title, content) {
        return await ScheduleRepository.updateDaySchedule(dayId, title, content);
    }

    async deleteDaySchedule(dayId) {
        return await ScheduleRepository.deleteDaySchedule(dayId);
    }

    // Schedule 관련 메서드
    async createSchedule(dayId, userId, title, dateTime) {
        return await ScheduleRepository.createSchedule(dayId, userId, title, dateTime);
    }

    async getSchedules(dayId, userId) {
        return await ScheduleRepository.getSchedules(dayId, userId);
    }

    async getSchedulesByDate(dayId, userId, startDate, endDate) {
        return await ScheduleRepository.getSchedulesByDate(dayId, userId, startDate, endDate);
    }

    async getScheduleById(scheduleId) {
        return await ScheduleRepository.getScheduleById(scheduleId);
    }

    async updateSchedule(scheduleId, title, dateTime) {
        return await ScheduleRepository.updateSchedule(scheduleId, title, dateTime);
    }

    async deleteSchedule(scheduleId) {
        return await ScheduleRepository.deleteSchedule(scheduleId);
    }
}

module.exports = new ScheduleService();
