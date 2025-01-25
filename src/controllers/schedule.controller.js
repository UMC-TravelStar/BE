const ScheduleService = require("../services/schedule.service");
const ScheduleDto = require("../dtos/schedule.dto");
const DayScheduleDto = require("../dtos/daySchedule.dto");

class ScheduleController {
    // Day_schedule 추가
    async addDaySchedule(req, res) {
        const { date, title, content } = req.body;
        const userId = req.params.user_id;

        if (!date) {
            return res.status(400).json({ message: "날짜를 입력해주세요." });
        }

        try {
            const daySchedule = await ScheduleService.createDaySchedule(userId, new Date(date), title, content);
            res.status(201).json(new DayScheduleDto(daySchedule.date, daySchedule.title, daySchedule.content));
        } catch (error) {
            console.error("일정 추가 실패:", error);
            res.status(500).json({ message: "일정 추가 실패", error: error.message });
        }
    }

    // Day_schedule 조회
    async getDaySchedules(req, res) {
        const userId = req.params.user_id;

        try {
            const daySchedules = await ScheduleService.getDaySchedules(userId);
            res.status(200).json(daySchedules.map(ds => new DayScheduleDto(ds.date, ds.title, ds.content)));
        } catch (error) {
            console.error("일정 조회 실패:", error);
            res.status(500).json({ message: "일정 조회 실패", error: error.message });
        }
    }

    // Day_schedule 수정
    async updateDaySchedule(req, res) {
        const { title, content } = req.body;
        const userId = req.params.user_id;
        const dayId = parseInt(req.params.day_id);

        try {
            const daySchedule = await ScheduleService.getDayScheduleById(dayId);
            if (daySchedule.user_id !== userId) {
                return res.status(403).json({ message: "수정 권한이 없습니다." });
            }

            const updatedDaySchedule = await ScheduleService.updateDaySchedule(dayId, title, content);
            res.status(200).json(new DayScheduleDto(updatedDaySchedule.date, updatedDaySchedule.title, updatedDaySchedule.content));
        } catch (error) {
            console.error("일정 수정 실패:", error);
            res.status(500).json({ message: "일정 수정 실패", error: error.message });
        }
    }

    // Day_schedule 삭제
    async deleteDaySchedule(req, res) {
        const dayId = parseInt(req.params.day_id);
        const userId = req.params.user_id;

        try {
            const daySchedule = await ScheduleService.getDayScheduleById(dayId);
            if (daySchedule.user_id !== userId) {
                return res.status(403).json({ message: "삭제 권한이 없습니다." });
            }

            await ScheduleService.deleteDaySchedule(dayId);
            res.status(200).json({ message: "일정 삭제 성공" });
        } catch (error) {
            console.error("일정 삭제 실패:", error);
            res.status(500).json({ message: "일정 삭제 실패", error: error.message });
        }
    }

    // Schedule 추가
    async addSchedule(req, res) {
        const { title, date_time } = req.body;
        const userId = req.params.user_id;
        const dayId = parseInt(req.params.day_id);

        if (!title || !date_time) {
            return res.status(400).json({ message: "일정 제목과 날짜/시간을 입력해주세요." });
        }

        try {
            const schedule = await ScheduleService.createSchedule(dayId, userId, title, new Date(date_time));
            res.status(201).json(new ScheduleDto(schedule.title, schedule.date_time));
        } catch (error) {
            console.error("일정 추가 실패:", error);
            res.status(500).json({ message: "일정 추가 실패", error: error.message });
        }
    }

    // 날짜별 Schedule 조회
    async getSchedulesByDate(req, res) {
        const userId = req.params.user_id;
        const dayId = parseInt(req.params.day_id);
        const { date } = req.query;

        try {
            let schedules;
            if (date) {
                const startDate = new Date(date);
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 1);
                schedules = await ScheduleService.getSchedulesByDate(dayId, userId, startDate, endDate);
            } else {
                schedules = await ScheduleService.getSchedules(dayId, userId);
            }

            res.status(200).json(schedules.map(s => new ScheduleDto(s.title, s.date_time)));
        } catch (error) {
            console.error("일정 조회 실패:", error);
            res.status(500).json({ message: "일정 조회 실패", error: error.message });
        }
    }

    // Schedule 수정
    async updateSchedule(req, res) {
        const { title, date_time } = req.body;
        const userId = req.params.user_id;
        const scheduleId = parseInt(req.params.schedule_id);
        const dayId = parseInt(req.params.day_id);

        try {
            const schedule = await ScheduleService.getScheduleById(scheduleId);
            if (schedule.user_id !== userId) {
                return res.status(403).json({ message: "수정 권한이 없습니다." });
            }

            const updatedSchedule = await ScheduleService.updateSchedule(scheduleId, title, new Date(date_time));
            res.status(200).json(new ScheduleDto(updatedSchedule.title, updatedSchedule.date_time));
        } catch (error) {
            console.error("일정 수정 실패:", error);
            res.status(500).json({ message: "일정 수정 실패", error: error.message });
        }
    }

    // Schedule 삭제
    async deleteSchedule(req, res) {
        const scheduleId = parseInt(req.params.schedule_id);
        const userId = req.params.user_id;
        const dayId = parseInt(req.params.day_id);

        try {
            const schedule = await ScheduleService.getScheduleById(scheduleId);
            if (schedule.user_id !== userId) {
                return res.status(403).json({ message: "삭제 권한이 없습니다." });
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
