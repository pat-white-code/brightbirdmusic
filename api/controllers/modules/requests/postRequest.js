const mysql = require('mysql');
const pool = require('../../../mysql/connection');

const postRequest = (req, res, next) => {
  // student_id is fetched from client_id and embedded in form
  // instrument_id and lesson_duration are user inputs
  let sql = `
  INSERT INTO service_requests (
    student_id, instrument_id, lesson_duration
  )
  VALUES
  (?, ?, ?);
  `;
  let replacements = [req.body.studentId, req.body.instrumentId, req.body.lessonDuration];
  sql = mysql.format(sql, replacements);
  pool.query(sql, (err, results)=> {
    if (err){return res.status(500).send(err)}
    req.body.requestId = results.insertId;
    next();
    // res.status(201).send(`request created with id ${results.insertId}`);
  })
}

module.exports = postRequest;