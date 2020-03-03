// given a client id,
// receive first_name,
// last_name,
// DOB 
// of student in body

const mysql = require('mysql');
const pool = require('../../../mysql/connection');

const postStudent = (req, res) => {
  let sql = `
    INSERT INTO students (
      client_id, first_name, last_name, dob, active, address_id
    )
    VALUES
      (?, ?, ?, ?, 1, ?);
  `
  let replacements = [req.body.clientId, req.body.firstName, req.body.lastName, req.body.dob, req.body.address]
  sql = mysql.format(sql, replacements);
  pool.query(sql, (err, results)=> {
    if(err){return res.status(500).send(err)}
    return res.status(201).send(`student created with id: ${results.insertId}`)
  })
}

module.exports = postStudent;