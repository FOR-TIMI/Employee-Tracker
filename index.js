const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const sql = require('./db/sql');





function init(){
    const app = {};

    const createDatabase = require('./db/db');
    const seedTables = require('./db/seeds');
    const createTables = require('./db/schemas');

    app.initializeDatabase = async function(){
        const result_1 = await new Promise(function (fulfill, reject) {
            //do something for 5 seconds
            fulfill(createDatabase());
        });
        const result_3 = await new Promise(function (fulfill_1, reject_1) {
            //do something for 5 seconds
            fulfill_1(createTables());
        });
        return await new Promise(function (fulfill_2, reject_2) {
            //do something for 8 seconds
            fulfill_2(seedTables());
        });
      }
      
      

    app.selectOption = function(){
        inquirer.prompt([
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
                case 'View All Departments' : this.viewDepartments();
                break;
                case 'View All Roles':  this.viewRoles();
                break;
                case 'View All Employees': this.viewEmployees();
                break;
                case 'Add Department': this.addDepartment();
                break;
                case 'Add Role': this.addRole();
                break;
                case 'Update Employee Role': this.updateEmployeeRole();
                break;
            }
        })

    }


    app.initializeDatabase();
    app.selectOption();

}


init();