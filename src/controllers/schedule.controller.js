const ScheduleService = require("../services/schedule.service");
const ScheduleDto = require("../dtos/schedule.dto");

const convertToKST = (date) => {
  const kstOffset = 9 * 60 * 60 * 1000; // KST는 UTC+9
  return new Date(date.getTime() + kstOffset);
};

// handleAddSchedule
const handleAddSchedule = async (req, res) => {
  const { location, date_time } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "인증이 필요합니다." });
  }

  if (!location || !date_time) {
    return res.status(400).json({ message: "위치와 날짜/시간을 입력해주세요." });
  }

  try {
    const schedule = await ScheduleService.createSchedule(
      userId,
      location,
      convertToKST(new Date(date_time)) 
    );
    res.status(201).json(new ScheduleDto(schedule));
  } catch (error) {
    console.error("일정 추가 실패:", error);
    res.status(500).json({ message: "일정 추가 실패", error: error.message });
  }
};

const handleGetSchedules = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "인증이 필요합니다." });
  }
  
  const { date } = req.params; // 날짜 파라미터(옵션)

  try {
    let schedules;
    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "유효한 날짜를 입력해주세요." });
      }
      schedules = await ScheduleService.getSchedulesByDate(userId, parsedDate);
    } else {
      schedules = await ScheduleService.getAllSchedules(userId);
    }
    res.status(200).json(schedules.map((s) => new ScheduleDto(s)));
  } catch (error) {
    console.error("일정 조회 실패:", error);
    res.status(500).json({ message: "일정 조회 실패", error: error.message });
  }
};

const handleGetScheduleById = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "인증이 필요합니다." });
  }
  const scheduleId = parseInt(req.params.schedule_id);
  try {
    const schedule = await ScheduleService.getScheduleById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: "일정을 찾을 수 없습니다." });
    }
    res.status(200).json(new ScheduleDto(schedule));
  } catch (error) {
    console.error("일정 조회 실패:", error);
    res.status(500).json({ message: "일정 조회 실패", error: error.message });
  }
};


const handleUpdateSchedule = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "인증이 필요합니다." });
  }
  const scheduleId = parseInt(req.params.schedule_id);
  const { location, date_time } = req.body;

  try {
    const updatedSchedule = await ScheduleService.updateSchedule(
      scheduleId,
      location,
      convertToKST(new Date(date_time)) 
    );
    res.status(200).json(new ScheduleDto(updatedSchedule));
  } catch (error) {
    console.error("일정 수정 실패:", error);
    res.status(500).json({ message: "일정 수정 실패", error: error.message });
  }
};

const handleDeleteSchedule = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "인증이 필요합니다." });
  }
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