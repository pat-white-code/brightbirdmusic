const mysql = require('mysql');
const pool = require('../../../mysql/connection');

const getClientRequests = (req, res) => {
  let sql = `
    SELECT students.first_name, students.last_name, instruments.id AS instrument_id, instruments.instrument_name, service_requests.lesson_duration, addresses.zip_code, students.dob, addresses.address, addresses.street
    FROM clients
    JOIN students
      ON students.client_id = clients.id
    JOIN service_requests
      ON service_requests.student_id = students.id
    JOIN instruments
      ON service_requests.instrument_id = instruments.id
  JOIN addresses
    ON addresses.id = students.address_id
    WHERE clients.id = ?;
  `
  let replacements = [req.params.clientId];

  sql = mysql.format(sql, replacements);
  pool.query(sql, (err, rows)=> {
    if(err) {return res.status(500).send(err)}
    return res.json(rows);
  })
}

module.exports = getClientRequests;