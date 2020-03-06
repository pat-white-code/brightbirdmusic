const takeAttendance = require('./modules/lessons/takeAttendance');
const bulkTakeAttendance = require('./modules/lessons/bulkTakeAttendance');
const getUnloggedLessons = require('./modules/lessons/getUnloggedLessons');
const getLastLesson = require('./modules/lessons/getLastLesson');

module.exports = {
  takeAttendance,
  bulkTakeAttendance,
  getUnloggedLessons,
  getLastLesson
}