
const mysql = require('mysql2');
require('dotenv').config()

function createDatabase(){
  const app = {};

  app.dbName = 'employee_tracker';

  app.databaseConnection = function(){
    const con = mysql.createConnection(
        {
            host: 'localhost',
            // Your MySQL username,
            user: 'root',
            // Your MySQL password
            password: process.env.SQL_SECRET || this.password,
        });
        return con.promise();
  }

  app.createDatabase = async function(){
    const con  = this.databaseConnection()
    await con.connect();
    await con.query(`DROP DATABASE IF EXISTS ${this.dbName};`)
    await con.query(`CREATE DATABASE ${this.dbName};`);

  }

return app.createDatabase();
}

module.exports = createDatabase;

