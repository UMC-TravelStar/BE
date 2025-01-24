const ScheduleService = require("../services/schedule.service");
const ScheduleDto = require("../dtos/schedule.dto");

class ScheduleController {
    async addSchedule(req, res) {
        const { title, date_time } = req.body;
        const userId = parseInt(req.params.user_id);

        if (!title || !date_time) {
            return res.status(400).json({ message: "일정 제목과 날짜/시간을 입력해주세요." });
        }

        try {
            const schedule = await ScheduleService.createSchedule(userId, title, new Date(date_time));
            res.status(201).json(new ScheduleDto(schedule.title, schedule.date_time));
        } catch (error) {
            console.error("일정 추가 실패:", error);
            res.status(500).json({ message: "일정 추가 실패", error: error.message });
        }
    }

    async getSchedules(req, res) {
        const userId = parseInt(req.params.user_id);
        const { date } = req.query;
    
        try {
            let schedules;
            if (date) {
                const startDate = new Date(date);
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 1);
                schedules = await ScheduleService.getSchedulesByDate(userId, startDate, endDate);
            } else {
                schedules = await ScheduleService.getSchedules(userId);
            }
    
            // 일정이 없는 경우 메시지 반환
            if (schedules.length === 0) {
                return res.status(200).json({ message: "일정이 없어요! 추가해주세요!" });
            }
    
            // 날짜/시간 순으로 정렬
            schedules.sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
    
            res.status(200).json(schedules.map(schedule => new ScheduleDto(schedule.title, schedule.date_time)));
        } catch (error) {
            console.error("일정 조회 실패:", error);
            res.status(500).json({ message: "일정 조회 실패", error: error.message });
        }
    }
    
    async updateSchedule(req, res) {
        const { title, date_time } = req.body;
        const userId = parseInt(req.params.user_id);
        const scheduleId = parseInt(req.params.schedule_id);

        try {
            const schedule = await ScheduleService.getScheduleById(scheduleId);
            if (schedule.user_id !== userId) {
                return res.status(403).json({ message: "이 일정에 대한 수정 권한이 없습니다." });
            }

            const updatedSchedule = await ScheduleService.updateSchedule(scheduleId, title, new Date(date_time));
            res.status(200).json(new ScheduleDto(updatedSchedule.title, updatedSchedule.date_time));
        } catch (error) {
            console.error("일정 수정 실패:", error);
            res.status(500).json({ message: "일정 수정 실패", error: error.message });
        }
    }

    async deleteSchedule(req, res) {
        const scheduleId = parseInt(req.params.schedule_id);
        const userId = parseInt(req.params.user_id);

        try {
            const schedule = await ScheduleService.getScheduleById(scheduleId);
            if (schedule.user_id !== userId) {
                return res.status(403).json({ message: "이 일정에 대한 삭제 권한이 없습니다." });
            }

            await ScheduleService.deleteSchedule(scheduleId);
            res.status(200).json({ message: "일정 삭제 성공" });
        } catch (error) {
            console.error("일정 삭제 실패:", error);
            res.status(500).json({ message: "일정 삭제 실패", error: error.message });
        }
    }
}

module.exports = new ScheduleController();
