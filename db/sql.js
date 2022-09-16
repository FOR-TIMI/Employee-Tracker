const mysql = require('mysql2');
const cTable = require('console.table')
require('dotenv').config()

class sql {
    //So you can create your database and set password easily
    constructor(dbName = 'employee_tracker',password = ''){
        this.dbName = dbName,
        this.password = password
    }
   
    //Connection to the database with authentication
    #getDB(){
        return mysql.createConnection(
            {
              host: 'localhost',
              // Your MySQL username,
              user: 'root',
              // Your MySQL password
              password: process.env.SQL_SECRET || this.password,
            }).promise();
    }

    //Drops database if exists then creates a new database
   async #dropDB(){
    const db = this.#getDB();
      await db.query(`DROP DATABASE IF EXISTS ${this.dbName};`) 
      await db.query(`CREATE DATABASE ${this.dbName};`);
    }

    //To query the database
    async #queryDB(query,params =''){
        const db = this.#getDB();
        await db.connect();
        await db.query(`USE ${this.dbName}`);
        await db.query(`SET FOREIGN_KEY_CHECKS = 0;`)
        db.query(query,params);
    }

    //Schema for the department table 
    #departmentSchema(){
        return  `CREATE TABLE departments(
              id INTEGER AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(30) NOT NULL
            );`
    }

    //Schema for the role table 
    #roleSchema(){
      return `CREATE TABLE roles( 
        id INTEGER AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(30) NOT NULL,
        salary DECIMAL NOT NULL,
        department_id INTEGER, 
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
        );`
    }

    //Schema for the employee table 
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

    //Initializes the database with some seed data
   async init(){  
        await this.#dropDB();
        await this.#queryDB(this.#departmentSchema());
        await this.#queryDB(this.#roleSchema());   
        await this.#queryDB(this.#employeeSchema());
        this.#seedAll();
    }

    //Seeds all the tables;
     #seedAll(){
        //Seed Departments
       this.#seedDepartments();

        //Seed Roles
        this.#seedRoles()

        //Seed Employees
        this.#seedEmployees();
    }

   
    //store seed Department for employees
    //Refrences function to add each Department to the database 
    #seedDepartments(){
           const sampleDepartmentData = ['Sales', 'Engineering','Finance','Legal']
           sampleDepartmentData.forEach(department => this.addDepartments(department))
    }

    //store seed Data for roles
    //Refrences function to add each role to the database 
    #seedRoles(){
        const sampleRoleData = [
            {title:'Sales Lead', salary:100000,department_id:1 },
            {title:'SalesPerson', salary:300000,department_id:1 },
            {title:'Lead Engineer', salary:500000,department_id:2 },
            {title:'Software Engineer', salary:600000,department_id:2 },
            {title:'Account Manager', salary:450000,department_id:3 },
            {title:'Accountant', salary:364000,department_id:3 },
            {title:'Legal Team Lead', salary:424000,department_id:4 },
            {title:'Lawyer', salary:700000,department_id:4 },
        ]

        sampleRoleData.forEach(role => this.addRoles(role.title,role.salary,role.department_id))   
    }

    //store seed Data for employees
    //Refrences function to add each employee to the database 
    async #seedEmployees(){
        //Seed Employees
        const sampleEmployeeData = [
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

        sampleEmployeeData.forEach(e => {
                this.addEmployees(e.first,e.last,e.roleId,e.managerId)
        })
 
    }

    //Insert an employee to database
    async addEmployees(first_name,last_name,role_id,manager_id){
        const pool = this.#createPool();
        const sql = `INSERT INTO employees (first_name,last_name,role_id,manager_id)VALUES(?,?,?,?)`
        const params = [first_name,last_name,role_id,manager_id]

         await pool.query(sql,params);
    }

    //Insert a Department to database
    async addDepartments(params){
        const sql = `INSERT INTO departments(name)VALUES(?);`
        const pool = this.#createPool();
        // query database using promises
        await pool.query(sql,params);
    }
    
    //Insert a Role to the database
    async addRoles(title,salary,department_id){
       const sql =  `INSERT INTO roles ( title , salary,department_id)VALUES (?,?,?)`;
       const params = [title,salary,department_id]

       const pool = this.#createPool();
       // query database using promises
       await pool.query(sql,params);
    }
    
    

    //Update Section
    updateManager(){

    }

    viewByManager(){

    }
   
    // View employees by department.
    viewByDepartment(){

    }

    // Delete departments, roles, and employees.
    deleteDepartment(){

    }

    deleteRoles(){

    }

    deleteEmployees(){

    }


    // View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.
    viewBudget(){

    }
   // create the pool
    #createPool(){
        const pool = mysql.createPool({host:'localhost', user: 'root', database: this.dbName, password: process.env.SQL_SECRET || this.password,});
        const promisePool = pool.promise();
        return promisePool
    }

    async viewAllEmployees(){
        const pool = this.#createPool();
        // departments.name AS department
        // query database using promises
        const [rows] = await pool.query(
                          `SELECT e.*,
                           m.first_name AS manager_name,
                           r.title, r.salary, r.department_id,
                           departments.name AS department
                           FROM employees e 
                            LEFT JOIN employees m
                            ON e.manager_id = m.id
                            LEFT JOIN  roles r
                            ON e.role_id = r.id
                            LEFT JOIN departments
                            ON r.department_id = departments.id;

                        
                            `);
        const employees = cTable.getTable(rows);
        console.log(employees);
    }


    async viewAllDepartments(){
        const pool = this.#createPool();
        const [rows] = await pool.query('SELECT * FROM departments');
        const departments = cTable.getTable(rows);
        console.log(departments);
    }

    async viewAllRoles(){
        const pool = this.#createPool();
        const [rows] = await pool.query(` 
                                        SELECT roles.id,roles.title,roles.salary, departments.name AS department
                                         FROM roles
                                         LEFT JOIN departments
                                         ON roles.department_id = departments.id;`);
        const roles = cTable.getTable(rows);
        console.log(roles);
    }


}



module.exports = new sql();