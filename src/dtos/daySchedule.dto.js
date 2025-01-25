class DayScheduleDto {
  constructor(daySchedule) {
      this.day_id = daySchedule.day_id;
      this.date = daySchedule.date;
      this.title = daySchedule.title;
      this.content = daySchedule.content;
      this.created_at = daySchedule.created_at;
      this.updated_at = daySchedule.updated_at;
  }
}

module.exports = DayScheduleDto;
