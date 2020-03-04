const getTeacherSchedule = require('./modules/schedules/getTeacherSchedule');
const getLessonsByScheduleId = require('./modules/schedules/getLessonsByScheduleId');
const postSchedules = require('./modules/schedules/postSchedules');
const postRecurringSchedule = require('./modules/schedules/postRecurringSchedule');
const getRecurringSchedules = require('./modules/schedules/getRecurringSchedules');

module.exports = {
  getTeacherSchedule,
  getLessonsByScheduleId,
  postSchedules,
  postRecurringSchedule,
  getRecurringSchedules
}
