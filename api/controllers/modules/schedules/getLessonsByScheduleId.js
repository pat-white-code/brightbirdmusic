const mysql = require('mysql');
const pool = require('../../../mysql/connection');

const getLessonsByScheduleId = (req, res) => {
  let sql = `
    SELECT teachers.first_name, teachers.last_name, schedules.date_, start_from, end_by, day_time, duration, students.first_name, students.last_name
    FROM lessons
    JOIN schedules
      ON lessons.schedule_id = schedules.id
    JOIN students
      ON lessons.student_id = students.id
    JOIN teachers
      ON lessons.teacher_id = teachers.id
    WHERE schedules.id = ?;
  `;

  let replacements = [req.params.schedule_id]
  sql = mysql.format(sql, replacements);
  pool.query(sql, (err, rows) => {
    if(err) {
      return res.status(500).send(err);
    }
    return res.send(rows);
  })
}

module.exports = getLessonsByScheduleId;