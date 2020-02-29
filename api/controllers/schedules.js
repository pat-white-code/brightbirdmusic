const getTeacherSchedule = require('./modules/schedules/getTeacherSchedule');
const getLessonsByScheduleId = require('./modules/schedules/getLessonsByScheduleId');
const putSchedules = require('./modules/schedules/putSchedules');

module.exports = {
  getTeacherSchedule,
  getLessonsByScheduleId,
  putSchedules
}
