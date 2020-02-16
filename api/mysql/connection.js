const mysql = require('mysql');

class Connection {
  constructor(){
  if(!this.pool) {
    console.log('creating conneciton...')
    this.pool = mysql.createPool({
      connectionLimit: 100,
      host: '35.222.166.74',
      user: 'root',
      password: 'JoeBiden354',
      // password: process.env.connection_password,
      database: 'admin'
      })
    return this.pool;
    }
  return this.pool
  } 
}

const instance = new Connection()

module.exports = instance;