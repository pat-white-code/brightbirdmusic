const getTeacherSchedule = require('./modules/schedules/getTeacherSchedule');
const getLessonsByScheduleId = require('./modules/schedules/getLessonsByScheduleId');
const postSchedules = require('./modules/schedules/postSchedules');
const postRecurringSchedule = require('./modules/schedules/postRecurringSchedule');

module.exports = {
  getTeacherSchedule,
  getLessonsByScheduleId,
  postSchedules,
  postRecurringSchedule
}
