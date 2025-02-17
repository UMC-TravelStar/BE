const scheduleRepository = require("../repositories/schedule.repository");

const createSchedule = async (userId, location, dateTime) => {
  return await scheduleRepository.createSchedule(userId, location, dateTime);
};

const getAllSchedules = async (userId) => {
  return await scheduleRepository.getAllSchedules(userId);
};

const getSchedulesByDate = async (userId, date) => {
  return await scheduleRepository.getSchedulesByDate(userId, date);
};

const getScheduleById = async (scheduleId) => {
  return await scheduleRepository.getScheduleById(scheduleId);
};

const updateSchedule = async (scheduleId, location, dateTime) => {
  return await scheduleRepository.updateSchedule(scheduleId, location, dateTime);
};

const deleteSchedule = async (scheduleId) => {
  return await scheduleRepository.deleteSchedule(scheduleId);
};

module.exports = {
  createSchedule,
  getAllSchedules,
  getSchedulesByDate,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
