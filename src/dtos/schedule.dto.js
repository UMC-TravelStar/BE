class ScheduleDto {
  constructor(schedule) {
      this.schedule_id = schedule.schedule_id;
      this.location = schedule.location;
      this.date_time = schedule.date_time;
      this.created_at = schedule.created_at;
      this.updated_at = schedule.updated_at;
  }
}

module.exports = ScheduleDto;
