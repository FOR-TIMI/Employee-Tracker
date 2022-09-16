const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const sql = require('./db/sql');

//  SELECT emp.*, manager.first_name AS manager_name     
//  FROM employees emp
//  join employees manager
//  ON emp.manager_id = manager.id;



// sql.init();

sql.viewAllEmployees();
sql.viewAllRoles();

// async function init(){

// sql.viewAllEmployees()
// }
// init();

// sql.addEmployees('Tommy','Gheller',3,5);
// sql.viewAllEmployees();
// sql.addDepartments('Services');
sql.viewAllDepartments();








// function init(){
//     const app = {};

//     app.selectOption = function(){
//         inquirer.prompt([
//             {
//                 name : 'option',
//                 message: 'What would you like to do?',
//                 type : 'list',
//                 choices : ['View All Departments',
//                         'View All Roles',
//                         'View All Employees',
//                         'Add Department',
//                         'Add Role',
//                         'Add Employee',
//                         'Update Employee Role'
//                          ]
//             }
//         ]).then((answer) => {
//             switch(answer.option){
//                 case 'View All Departments' : this.viewDepartments();
//                 break;
//                 case 'View All Roles':  this.viewRoles();
//                 break;
//                 case 'View All Employees': this.viewEmployees();
//                 break;
//                 case 'Add Department': this.addDepartment();
//                 break;
//                 case 'Add Role': this.addRole();
//                 break;
//                 case 'Update Employee Role': this.updateEmployeeRole();
//                 break;
//             }
//         })

//     }

//     app.viewDepartments = async function(){
//         const sql = `SELECT * FROM departments`
//         await db.query(sql, (err,rows) => {
//             console.table(rows);
//         })
//     }

//     app.selectOption()

// }


// init();