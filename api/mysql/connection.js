const mysql = require('mysql');

class Connection {
  constructor(){
  if(!this.pool) {
    console.log('creating conneciton...')
    this.pool = mysql.createPool({
      connectionLimit: 100,
      host: '35.222.166.74',
      user: 'root',
      password: sql_pass,
      database: 'admin',
      })
    return this.pool;
    }
  return this.pool
  } 
}