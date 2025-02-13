const ScheduleService = require("../services/schedule.service");
const ScheduleDto = require("../dtos/schedule.dto");

const handleAddSchedule = async (req, res) => {
    const { location, date_time } = req.body;
    const userId = req.userId; // 인증된 사용자 ID 가져오기

    if (!location || !date_time) {
        return res.status(400).json({ message: "위치와 날짜/시간을 입력해주세요." });
    }

    try {
        const schedule = await ScheduleService.createSchedule(userId, location, new Date(date_time));
        res.status(201).json(new ScheduleDto(schedule));
    } catch (error) {
        console.error("일정 추가 실패:", error);
        res.status(500).json({ message: "일정 추가 실패", error: error.message });
    }
};

const handleGetSchedules = async (req, res) => {
    const userId = req.userId; // 인증된 사용자 ID 가져오기
    const { date } = req.params;

    try {
        const schedules = await ScheduleService.getSchedulesByDate(userId, new Date(date));
        res.status(200).json(schedules.map(s => new ScheduleDto(s)));
    } catch (error) {
        console.error("일정 조회 실패:", error);
        res.status(500).json({ message: "일정 조회 실패", error: error.message });
    }
};

const handleGetScheduleById = async (req, res) => {
    const scheduleId = parseInt(req.params.schedule_id);

    try {
        const schedule = await ScheduleService.getScheduleById(scheduleId);
        res.status(200).json(new ScheduleDto(schedule));
    } catch (error) {
        console.error("일정 조회 실패:", error);
        res.status(500).json({ message: "일정 조회 실패", error: error.message });
    }
};

const handleUpdateSchedule = async (req, res) => {
    const scheduleId = parseInt(req.params.schedule_id);
    const { location, date_time } = req.body;

    try {
        const updatedSchedule = await ScheduleService.updateSchedule(scheduleId, location, new Date(date_time));
        res.status(200).json(new ScheduleDto(updatedSchedule));
    } catch (error) {
        console.error("일정 수정 실패:", error);
        res.status(500).json({ message: "일정 수정 실패", error: error.message });
    }
};

const handleDeleteSchedule = async (req, res) => {
    const scheduleId = parseInt(req.params.schedule_id);

    try {
        await ScheduleService.deleteSchedule(scheduleId);
        res.status(200).json({ message: "일정 삭제 성공" });
    } catch (error) {
        console.error("일정 삭제 실패:", error);
        res.status(500).json({ message: "일정 삭제 실패", error: error.message });
    }
};

module.exports = {
    handleAddSchedule,
    handleGetSchedules,
    handleGetScheduleById,
    handleUpdateSchedule,
    handleDeleteSchedule,
};
