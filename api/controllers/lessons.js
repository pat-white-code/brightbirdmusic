const takeAttendance = require('./modules/lessons/takeAttendance');
const bulkTakeAttendance = require('./modules/lessons/bulkTakeAttendance');
const getUnloggedLessons = require('./modules/lessons/getUnloggedLessons');

module.exports = {
  takeAttendance,
  bulkTakeAttendance,
  getUnloggedLessons
}