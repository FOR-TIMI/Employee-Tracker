const mysql = require('mysql2');
require('dotenv').config()

class sql {

    constructor(dbName = 'employee_tracker'){
        this.dbName = dbName
    }
   
    #getDB(){
        return mysql.createConnection(
            {
              host: 'localhost',
              // Your MySQL username,
              user: 'root',
              // Your MySQL password
              password: process.env.SQL_SECRET,
            }).promise();
    }

   async #dropDB(){
    const db = this.#getDB();
      await db.query(`DROP DATABASE IF EXISTS ${this.dbName};`) 
      await db.query(`CREATE DATABASE ${this.dbName};`);
    }

    #createDB(){
     return `CREATE DATABASE ${this.dbName};`
    }



    async #queryDB(query,params =''){
        const db = this.#getDB();
        await db.connect();
        await db.query(`USE ${this.dbName}`);
        await db.query(`SET FOREIGN_KEY_CHECKS = 0;`)
       return await db.query(query,params);
   
    }

    #departmentSchema(){
        return  `CREATE TABLE departments(
              id INTEGER AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(30) NOT NULL
            );`
    }

    #roleSchema(){
      return `CREATE TABLE roles( 
        id INTEGER AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(30) NOT NULL,
        salary DECIMAL NOT NULL,
        department_id INTEGER, 
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
        );`
    }

    #employeeSchema(){
     return `CREATE TABLE employees(
        id INTEGER AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(30) NOT NULL,
        role_id INTEGER,
        manager_id INTEGER, 
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
        FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
        );` 
    }

   async init(){  
        await this.#dropDB();
        await this.#queryDB(this.#departmentSchema());
        await this.#queryDB(this.#roleSchema());   
        await this.#queryDB(this.#employeeSchema());
        await this.#seed();
    }

    async #seed(){


        //Seed Departments
       this.#seedDepartments();


        
        //Seed Roles
        this.#seedRoles()

        //Seed Employees
        this.#seedEmployees();
    

    }

   

    #seedDepartments(){
        this.addDepartments('Sales');
        this.addDepartments('Engineering');
        this.addDepartments('Finance');
        this.addDepartments('Legal');
    }

    #seedRoles(){
        this.addRoles('Sales Lead',100000,1);
        this.addRoles('SalesPerson',300000,1);
        this.addRoles('Lead Engineer',500000,2);
        this.addRoles('Software Engineer',600000,2);
        this.addRoles('Account Manager', 450000, 3);
        this.addRoles('Accountant', 364000, 3);
        this.addRoles('Legal Team Lead', 424000, 4);
        this.addRoles('Lawyer', 700000, 4);
    }

    async #seedEmployees(){
        //Seed Employees
        const seedData = [
        {first : 'John',last :  'Doe',roleId: 1},
        {first : 'Mike', last: 'Chan', roleId: 1, managerId : 1},
        {first: 'Ashley',last:'Rodriguez', roleId:3},
        {first: 'Martin',last:'Lawrence', roleId:4, managerId : 3},
        {first: 'Kevin',last:'Tupik', roleId:4, managerId: 3},
        {first: 'Kunal',last:'Singh', roleId:5},
        {first: 'Malia',last:'Brown', roleId:6, managerId: 6},
        {first: 'Sarah',last:'Lourd', roleId:7},
        {first: 'Tom',last:'Allen', roleId: 8, managerId: 9},
        ]

        seedData.forEach(e => {
                this.addEmployees(e.first,e.last,e.roleId,e.managerId)
        })
 
    }

    //Insert a Department
    addDepartments(params){
        const sql = `INSERT INTO departments(name)VALUES(?);`
        this.#queryDB(sql,params);
    }
    
    //Insert a Role
   addRoles(title,salary,department_id){
       const sql =  `INSERT INTO roles ( title , salary,department_id)VALUES (?,?,?)`;
       const params = [title,salary,department_id]
       this.#queryDB(sql,params);
    }
    
    //Insert Employee
    addEmployees(first_name,last_name,role_id,manager_id){
        const sql = `INSERT INTO employees (first_name,last_name,role_id,manager_id)VALUES(?,?,?,?)`
        const params = [first_name,last_name,role_id,manager_id]
        this.#queryDB(sql,params);
    }


}



module.exports = new sql();