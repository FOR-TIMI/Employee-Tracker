
const mysql = require('mysql2');
require('dotenv').config()

function createTables(){
    const app = {}

    app.setSchemas = async function(){
           await this.setDepartmentSchema();
           await this.setRolesSchema();
           await this.setEmployeeSchema();
    }

    app.connection =  async function(){
        return mysql.createConnection(
            {
                host: 'localhost',
                // Your MySQL username,
                user: 'root',
                // Your MySQL password
                password: process.env.SQL_SECRET,
                //The database name
                database: 'employee_tracker'
            })
         
    }

    app.queryDB = async function(sql){
        const db = await this.connection();

         db.connect();
         db.query(`USE employee_tracker;`);
         db.query(sql);

    }
   
    app.setDepartmentSchema = async function(){
       //Schema for the department table 
      const sql = `CREATE TABLE departments(
        id INTEGER AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(30) NOT NULL
      );`

    await this.queryDB(sql);
    return;
    }

    app.setRolesSchema =async function(){
        //Schema for the role table 
        const sql = `CREATE TABLE roles( 
            id INTEGER AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(30) NOT NULL,
            salary DECIMAL NOT NULL,
            department_id INTEGER, 
            FOREIGN KEY (department_id) REFERENCES roles(id) ON DELETE SET NULL
            );`
    
           await this.queryDB(sql);
           return;
    }
    app.setEmployeeSchema = async function(){
       const sql =  `CREATE TABLE employees(
            id INTEGER AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(30) NOT NULL,
            last_name VARCHAR(30) NOT NULL,
            role_id INTEGER,
            manager_id INTEGER, 
            FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
            FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
            );` 
        await this.queryDB(sql);
        return;
    }

    return app.setSchemas();
}

const createDatabase = require('./db');
const seedTables = require('./seeds');


async function init(){
    await createDatabase()
    await createTables()
    await seedTables()
}

init()


