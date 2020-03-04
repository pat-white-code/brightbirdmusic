const mysql = require('mysql');
const pool = require('../../../mysql/connection');

const putSubscription = (req, res) => {

  let sql = `
    UPDATE subscriptions
    SET day_id = ?,
      time_ = ?,
      start_date = ?,
      instrument_id = ?,
      lesson_price = ?,
      lesson_duration = ?
    WHERE id = ?;
  `
  let replacements = [
    req.body.dayId,
    req.body.time,
    req.body.startDate,
    req.body.instrumentId,
    req.body.lessonPrice,
    req.body.lessonDuration,
    req.params.subscriptionId
  ];

  sql = mysql.format(sql, replacements);
  pool.query(sql, (err, rows)=> {
    if(err) {return res.status(500).send(err)}
    return res.status(200).send(`subscription ${req.params.subscriptionId} updated`)
  })
}

module.exports = putSubscription;