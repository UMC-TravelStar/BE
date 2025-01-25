const ScheduleRepository = require("../repositories/schedule.repository");

class ScheduleService {
    // Day_schedule 생성
    async createDaySchedule(userId, date, title, content) {
        return await ScheduleRepository.createDaySchedule(userId, date, title, content);
    }

    // Day_schedule 조회
    async getDaySchedules(userId) {
        return await ScheduleRepository.getDaySchedules(userId);
    }

    // Day_schedule 수정
    async updateDaySchedule(dayId, title, content) {
        return await ScheduleRepository.updateDaySchedule(dayId, title, content);
    }

    // Day_schedule 삭제
    async deleteDaySchedule(dayId) {
        return await ScheduleRepository.deleteDaySchedule(dayId);
    }

    // Schedule 생성
    async createSchedule(dayId, userId, location, dateTime) {
        return await ScheduleRepository.createSchedule(dayId, userId, location, dateTime);
    }

    // Schedule 조회
    async getSchedules(dayId) {
        return await ScheduleRepository.getSchedules(dayId);
    }

    // Schedule 수정
    async updateSchedule(scheduleId, location, dateTime) {
        return await ScheduleRepository.updateSchedule(scheduleId, location, dateTime);
    }

    // Schedule 삭제
    async deleteSchedule(scheduleId) {
        return await ScheduleRepository.deleteSchedule(scheduleId);
    }
}

module.exports = new ScheduleService();
