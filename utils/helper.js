const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');

require('dotenv').config();


const config =   {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: process.env.SQL_SECRET,
    //The database name
    database: 'employee_tracker'
}

const connection = async function(){
    return mysql.createConnection(config); 
}


const query = async function(sql,params){
    const db = await connection();
     db.connect();
     db.query(`USE employee_tracker;`);
    if(params){
        db.query(`SET FOREIGN_KEY_CHECKS = 0;`)
        db.query(sql,params);
    }
    else{
        db.query(sql);
    }  
}

const promptFeatures =  function(){
 return inquirer.prompt([
    {
        name : 'option',
        message: 'What would you like to do?',
        type : 'list',
        choices : ['View All Departments',
                'View All Roles',
                'View All Employees',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role'
                 ]
    }
]).then((answer) => {
    switch(answer.option){
        case 'View All Departments' : select(`SELECT * FROM departments;`);
        break;
        case 'View All Roles':  select(`SELECT * FROM roles;`);
        break;
        case 'View All Employees': select(`SELECT * FROM employees;`);
        break;
        case 'Add Department': promptDepartmentInsert();
        break;
        case 'Add Role': this.addRole();
        break;
        case 'Update Employee Role': this.updateEmployeeRole();
        break;
    }
   
}) 
}




const select =async function(sql){
    const pool = mysql.createPool(config).promise();
    const [rows] = await pool.query(sql);
    const data = cTable.getTable(rows);
    console.log(data);
    promptFeatures();
   
};

const manipulateTable = async function(sql,params){
    const pool = mysql.createPool(config).promise();
    await pool.query(sql,params);
    promptFeatures();    
};



module.exports = {query, select,promptFeatures, manipulateTable};

