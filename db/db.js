
const mysql = require('mysql2');
require('dotenv').config()
const {dbConfig} = require('./config')

function createDatabase(){
  const app = {};

  app.dbName = 'employee_tracker';

  app.databaseConnection = function(){
    const con = mysql.createConnection(dbConfig);
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

