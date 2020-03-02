const mysql = require('mysql');
const pool = require('../../../mysql/connection');
const moment = require('moment');

const postSubscriptionLessons = (req, res) => {
  console.log('LESSONS REQUEST OBJECT', req.body);
  let dayTime = moment(req.body.dayTime, 'YYYY-MM-DD HH:mm:ss');
  let endTime = dayTime.clone().add(req.body.duration, 'minutes').format('HH:mm:ss');

  let sql = `
  INSERT INTO lessons (
    day_time, duration, student_id, teacher_id, inst_id, subscription_id, price, tandem, date_, start_time, end_time
    )
  VALUES 
  ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );`;

  let replacements = [req.body.dayTime, req.body.duration, req.body.studentId, req.body.teacherId, req.body.instrumentId, req.body.subscriptionId, req.body.price, 0, req.body.startDate, req.body.time_, endTime];

  sql = mysql.format(sql, replacements);
  pool.query(sql, (err, rows)=> {
    if(err){return res.status(500).send(err)}
    return res.status(201).send('Lesson Created');
  })
}

module.exports = postSubscriptionLessons;