const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();

function seedTables(){
    const app  = {}


    
    app.setSeedData = async function(){
        await app.seedDepartments()
        await app.seedRoles()
        await app.seedEmployees()
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

    app.queryDB = async function(sql,params){
        const db = await this.connection();
         
         db.connect();
         db.query(`USE employee_tracker;`);
         db.query(`SET FOREIGN_KEY_CHECKS = 0;`)
         db.query(sql,params);

    }
  
      //store seed Department for employees
     //Refrences function to add each Department to the database 
     app.seedDepartments =   async function(){
         const sampleDepartmentData = ['Sales', 'Engineering','Finance','Legal']
         const sql = `INSERT INTO departments(name)VALUES(?);`
         sampleDepartmentData.forEach(async department => await this.queryDB(sql,department));
     }
    
       //Insert a roles to database
    app.seedRoles = async function(params){
        const sql =  `INSERT INTO roles ( title , salary,department_id)VALUES (?,?,?)`;
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


        // query database using promises
        sampleRoleData.forEach(async role => await this.queryDB(sql,[role.title,role.salary,role.department_id]))   
    }

    app.seedEmployees = async function(params){
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

    const sql = `INSERT INTO employees (first_name,last_name,role_id,manager_id)VALUES(?,?,?,?);`

        sampleEmployeeData.forEach(e => {
                this.queryDB(sql,[e.first,e.last,e.roleId,e.managerId])
        })
    }

  
  
  
     return app.setSeedData();


}


module.exports = seedTables