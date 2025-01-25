const ScheduleService = require("../services/schedule.service");
const DayScheduleDto = require("../dtos/daySchedule.dto");
const ScheduleDto = require("../dtos/schedule.dto");

const handleAddDaySchedule = async (req, res) => {
    const { date, title, content } = req.body;
    const userId = req.params.user_id;

    if (!date) {
        return res.status(400).json({ message: "날짜를 입력해주세요." });
    }

    try {
        const daySchedule = await ScheduleService.createDaySchedule(userId, new Date(date), title, content);
        res.status(201).json(new DayScheduleDto(daySchedule));
    } catch (error) {
        console.error("일정 추가 실패:", error);
        res.status(500).json({ message: "일정 추가 실패", error: error.message });
    }
};

const handleGetDaySchedules = async (req, res) => {
    const userId = req.params.user_id;

    try {
        const daySchedules = await ScheduleService.getDaySchedules(userId);
        res.status(200).json(daySchedules.map(ds => new DayScheduleDto(ds)));
    } catch (error) {
        console.error("일정 조회 실패:", error);
        res.status(500).json({ message: "일정 조회 실패", error: error.message });
    }
};

const handleGetDaySchedulesByDateInUrl = async (req, res) => {
    const userId = req.params.user_id;
    const { date } = req.params; // URL 파라미터에서 날짜를 가져옴

    try {
        const daySchedules = await ScheduleService.getDaySchedulesByDate(userId, new Date(date));
        res.status(200).json(daySchedules.map(ds => new DayScheduleDto(ds)));
    } catch (error) {
        console.error("일정 조회 실패:", error);
        res.status(500).json({ message: "일정 조회 실패", error: error.message });
    }
};

const handleUpdateDaySchedule = async (req, res) => {
    const { title, content } = req.body;
    const dayId = parseInt(req.params.day_id);

    try {
        const updatedDaySchedule = await ScheduleService.updateDaySchedule(dayId, title, content);
        res.status(200).json(new DayScheduleDto(updatedDaySchedule));
    } catch (error) {
        console.error("일정 수정 실패:", error);
        res.status(500).json({ message: "일정 수정 실패", error: error.message });
    }
};

const handleDeleteDaySchedule = async (req, res) => {
    const dayId = parseInt(req.params.day_id);

    try {
        await ScheduleService.deleteDaySchedule(dayId);
        res.status(200).json({ message: "일정 삭제 성공" });
    } catch (error) {
        console.error("일정 삭제 실패:", error);
        res.status(500).json({ message: "일정 삭제 실패", error: error.message });
    }
};

const handleAddSchedule = async (req, res) => {
    const { location, date_time } = req.body;
    const userId = req.params.user_id;
    const dayId = parseInt(req.params.day_id);

    if (!location || !date_time) {
        return res.status(400).json({ message: "위치와 날짜/시간을 입력해주세요." });
    }

    try {
        const schedule = await ScheduleService.createSchedule(dayId, userId, location, new Date(date_time));
        res.status(201).json(new ScheduleDto(schedule));
    } catch (error) {
        console.error("일정 추가 실패:", error);
        res.status(500).json({ message: "일정 추가 실패", error: error.message });
    }
};

const handleGetSchedules = async (req, res) => {
    const dayId = parseInt(req.params.day_id);

    try {
        const schedules = await ScheduleService.getSchedules(dayId);
        res.status(200).json(schedules.map(s => new ScheduleDto(s)));
    } catch (error) {
        console.error("일정 조회 실패:", error);
        res.status(500).json({ message: "일정 조회 실패", error: error.message });
    }
};

const handleGetSchedulesByDateInUrl = async (req, res) => {
    const dayId = parseInt(req.params.day_id);
    const { date } = req.params; // URL 파라미터에서 날짜를 가져옴

    try {
        const schedules = await ScheduleService.getSchedulesByDate(dayId, new Date(date));
        res.status(200).json(schedules.map(s => new ScheduleDto(s)));
    } catch (error) {
        console.error("일정 조회 실패:", error);
        res.status(500).json({ message: "일정 조회 실패", error: error.message });
    }
};


const handleUpdateSchedule = async (req, res) => {
    const { location, date_time } = req.body;
    const scheduleId = parseInt(req.params.schedule_id);

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
    handleAddDaySchedule,
    handleGetDaySchedules,
    handleDeleteSchedule,handleGetDaySchedulesByDateInUrl,
    handleUpdateDaySchedule,
    handleDeleteDaySchedule,
    handleAddSchedule,
    handleGetSchedules,
    handleGetSchedulesByDateInUrl,
    handleUpdateSchedule
};
