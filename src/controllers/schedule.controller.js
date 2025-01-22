// controllers/schedule.controller.js
const ScheduleService = require("../services/schedule.service");
const ScheduleDto = require("../dtos/schedule.dto");

class ScheduleController {
  async addSchedule(req, res) {
      const { title, date_time } = req.body; // userId는 URL 파라미터에서 가져옴
      const userId = parseInt(req.params.user_id); // user_id를 정수형으로 변환

      // 입력 데이터 검증
      if (!title || !date_time) {
          return res.status(400).json({ message: "일정 제목과 날짜/시간을 입력해주세요." });
      }

      try {
          const schedule = await ScheduleService.createSchedule(userId, title, new Date(date_time));
          res.status(201).json(new ScheduleDto(schedule.title, schedule.date_time)); // 응답에서 schedule_id를 제외
      } catch (error) {
          console.error("일정 추가 실패:", error);
          res.status(500).json({ message: "일정 추가 실패", error: error.message });
      }
  }


  async getSchedules(req, res) {
      const userId = parseInt(req.params.user_id);
      const { date } = req.query; // 쿼리 파라미터에서 날짜를 받음

      try {
          // 날짜가 제공된 경우
          if (date) {
              const startDate = new Date(date);
              const endDate = new Date(startDate);
              endDate.setDate(endDate.getDate() + 1); // 다음 날

              const schedules = await ScheduleService.getSchedulesByDate(userId, startDate, endDate);
              res.status(200).json(schedules);
          } else {
              // 날짜가 제공되지 않은 경우
              const schedules = await ScheduleService.getSchedules(userId);
              res.status(200).json(schedules);
          }
      } catch (error) {
          console.error("일정 조회 실패:", error);
          res.status(500).json({ message: "일정 조회 실패", error: error.message });
      }
  }

  async updateSchedule(req, res) {
      const { schedule_id, title, date_time } = req.body;

      // schedule_id를 정수형으로 변환
      const scheduleId = parseInt(schedule_id);

      try {
          const updatedSchedule = await ScheduleService.updateSchedule(scheduleId, title, new Date(date_time));
          res.status(200).json(updatedSchedule);
      } catch (error) {
          console.error("일정 수정 실패:", error);
          res.status(500).json({ message: "일정 수정 실패", error: error.message });
      }
  }

  async deleteSchedule(req, res) {
      const scheduleId = parseInt(req.params.schedule_id); // schedule_id를 정수형으로 변환

      try {
          await ScheduleService.deleteSchedule(scheduleId);
          res.status(200).json({ message: "일정 삭제 성공" });
      } catch (error) {
          console.error("일정 삭제 실패:", error);
          res.status(500).json({ message: "일정 삭제 실패", error: error.message });
      }
  }

}

module.exports = new ScheduleController();
