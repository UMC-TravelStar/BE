const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const prisma = new PrismaClient();

const createSchedule = async (userId, location, dateTime) => {
  return await prisma.schedule.create({
    data: {
      user: {
        connect: {
          user_id: userId,
        },
      },
      location,
      date_time: dateTime,
    },
  });
};

const getAllSchedules = async (userId) => {
  return await prisma.schedule.findMany({
    where: { user_id: userId },
  });
};

const getSchedulesByDate = async (userId, date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await prisma.schedule.findMany({
    where: {
      user_id: userId,
      date_time: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
  });
};

const getScheduleById = async (scheduleId) => {
  return await prisma.schedule.findUnique({
    where: { schedule_id: scheduleId },
  });
};

const updateSchedule = async (scheduleId, location, dateTime) => {
  return await prisma.schedule.update({
    where: { schedule_id: scheduleId },
    data: { location, date_time: dateTime },
  });
};

const deleteSchedule = async (scheduleId) => {
  return await prisma.schedule.delete({
    where: { schedule_id: scheduleId },
  });
};

module.exports = {
  createSchedule,
  getAllSchedules,
  getSchedulesByDate,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
