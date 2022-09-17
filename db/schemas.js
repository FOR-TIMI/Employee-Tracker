const { query} = require('../utils/helper')


async function createTables(){
    const app = {}

    app.setSchemas = async function(){
           await this.setDepartmentSchema();
           await this.setRolesSchema();
           await this.setEmployeeSchema();
    }

   
    app.setDepartmentSchema = async function(){
       //Schema for the department table 
      const sql = `CREATE TABLE departments(
        id INTEGER AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(30) NOT NULL
      );`

    await query(sql);
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
    
           await query(sql);
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
        await query(sql);
        return;
    }

    return await app.setSchemas();
}

const createDatabase = require('./db');
const seedTables = require('./seeds');


async function initalizeDatabase(){
    
    setTimeout(createDatabase,300);
    setTimeout(createTables,500);
    setTimeout(seedTables,600);
}



initalizeDatabase();

// createTables();


