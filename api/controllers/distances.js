const fetch = require('node-fetch');
const mysql = require('mysql');
const pool = require('../mysql/connection');


let address1 = '6616 Dogwood creek Drive, Austin, TX 78746';
let street1 = address1.replace(/\d+ /, "");
let formattedStreet1 = street1.replace(/ /g, "+");

let address2 = '1504 Bay Hill Dr, Austin, TX 78746';
let street2 = address2.replace(/\d+ /, "");
let formattedStreet2 = street2.replace(/ /g, "+");


fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${formattedStreet1}&destinations=${formattedStreet2}&key=AIzaSyAzq7W-eXQNz0ptPkQqWi9LBluABETr7Zs`)
  .then(res => res.json())
  .then(json => json.rows[0].elements[0].duration.value)
  .then(driveTime => {
    let sql = `
    INSERT INTO drive_times (
      address_1, address_2, drive_time_seconds
    )
    VALUES
      (?, ?, ?),
      (?, ?, ?);
    `;
    let replacements = [street1, street2, driveTime, street2, street1, driveTime];

    sql = mysql.format(sql, replacements);

    pool.query(sql, (err, rows) => {
      if(err) {
        console.log(err);
      }
      console.log('drive time inserted successfully');
    })
  })