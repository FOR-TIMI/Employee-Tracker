const inquirer = require('inquirer');
const chalk = require('chalk');
const mysql = require('mysql2');
require('dotenv').config();
const cTable = require('console.table');

//Create database and seed tables
const createDatabase = require('./db/db.js');
const seedTables = require('./db/seeds.js');
const createTables = require('./db/schemas.js');


//To set configuration
const {config}= require('./db/config');

//To add design pattern
const figlet = require('figlet');



//To add design pattern
const figlet = require('figlet');


//Configuration for my sql connection
const config =  {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: process.env.SQL_SECRET,
    //The database name
    database: 'employee_tracker'
}

// function to select tables
const select =async function(sql){

    const pool = mysql.createPool(config).promise();
    const [rows] = await pool.query(sql,params);
    const data = cTable.getTable(rows);
    console.log('\n', chalk.blue(data));
    promptFeatures();
   
};

//To return rows of data
const get = async function(sql){
    const pool = mysql.createPool(config).promise();
    const [rows] = await pool.query(sql);
    return rows
}

// To update,insert,delete from any table
const manipulateTable = async function(sql,params){
    const pool = mysql.createPool(config).promise();
    await pool.query(sql,params);
    promptFeatures();    
};

// To prompt features and options
function promptFeatures(){
    const department = new Department();
    const role = new Role();
    const employee = new Employee();
    return inquirer.prompt([
       {
           name : 'option',
           message: 'What would you like to do?',
           type : 'list',
           choices : [
                   'View Departments total Budget',
                   'View All Departments',
                   'View All Roles',
                   'View All Employees',
                   'View employee by manager',
                   'View employee by department',
                   'Add Department',
                   'Add Role',
                   'Add Employee',
                   'Update Employee Role',
                   'Update Employee Manager',
                   'Update department',
                   'Delete department',
                   'Delete Role',

                   'Delete Employee',

                   'Delete Employee'
                    ]
       }
   ]).then((answer) => {
       switch(answer.option){
           case 'View All Departments' : department.viewAll();
           break;
           case 'View All Roles':  role.viewAll();
           break;
           case 'View All Employees': employee.viewAll();
           break;
           case 'Add Department': department.insert();
           break;
           case 'Add Role': role.add();
           break;
           case 'Add Employee': employee.add();
           break;
           case 'Update Employee Role': employee.updateEmployeeRole();
           break;
           case 'Update Employee Manager': employee.updateEmployeeManager();
           break;
           case 'Update department': department.update();
           break;
           case 'Delete department': department.delete();
           break;
           case 'Delete Employee': employee.delete();

           break;
           case 'View Departments total Budget': department.viewTotalBudget();
           break;
           case 'View employee by manager': employee.viewEmployeeByManager();
           break;
           case 'View employee by department': employee.viewEmployeeByDepartment();
           break;
       }
      
   }) 
}

//To create a class for department
class Department{


 // To view all the existing departments 
  viewAll(){
    select(`SELECT * FROM departments`); 
   }

   //To insert into the departments table
   insert(){
        const question = [
            {
                name : 'departmentName',
                message: 'What department do you wish to add?',
                type : 'input',
                validate:function(val){
                    //Checks if the value is a valid string 
                    if(!/^-?[\d.]+(?:e-?\d+)?$/.test(val)){
                        return true;
                    } 
                    else{
                        console.log(chalk.red('Please enter a valid string'))
                        return false ;
                    }                
                  }
                }     
             ];
        
         inquirer.prompt(question)
         .then(answers=> {
            const sql = `INSERT INTO departments(name)VALUES(?);`
            manipulateTable(sql,answers.departmentName);
            console.log( chalk.green(`\n added ${answers.departmentName} to the database \n`))
         })

     };
 
  //To update an existing department
   async update(){
        const departments = await get(`SELECT id AS value, name FROM departments`);

        const questions = [
            {
                name : 'departmentId',
                message: 'what is the department do you want to update?',
                type : 'list',
                choices: departments,
             },
             {
                name : 'newDepartmentName',
                message: 'what new changes would you like to set?',
                type : 'input',
                validate: function(val){
                    if(val.length){
                        return !/^-?[\d.]+(?:e-?\d+)?$/.test(val) || console.log(chalk.red('Please enter a valid string')) ;
                    }
                    return false               
                    }
            }
             
        ]


        inquirer.prompt(questions)
        .then(
         ({departmentId,newDepartmentName }) => {
            const sql = `UPDATE departments
            SET name = ?
            WHERE id = ?;
           `
           const oldDepartment = departments.find(d => d.value === departmentId)
           const oldDepartmentName = oldDepartment.name
           manipulateTable(sql,[newDepartmentName,departmentId])        
           console.log(chalk.green(`\n ${oldDepartmentName} now set to ${newDepartmentName} \n`))
        })

   }

   //To delete a department
   async delete(){
         const departments = await get(`SELECT id AS value, name FROM departments`);
         const questions = [
            {
            name : 'departmentId',
            message: 'What department do you wish to delete?',
            type : 'list',
            choices: departments
          }
        ]

         inquirer.prompt(questions)
         .then(({departmentId}) => {
             const sql = `DELETE FROM departments WHERE id = ?` 
             const deletedDepartment = departments.find(d => d.value === departmentId)
             const deletedDepartmentName = deletedDepartment.name
            manipulateTable(sql,departmentId);           
            console.log(chalk.red(`\n The ${deletedDepartmentName} department was deleted \n`))
        })
    }

    //To get total budget of a department
    async viewTotalBudget(){
        const departments = await get(`SELECT id AS value, name FROM departments`);
        const questions =
         [
            {
                name : 'departmentId',
                message: 'What department\'s budget do you wish to see?',
                type : 'list',
                choices: departments
            }
        ]

        inquirer.prompt(questions)
        .then(({departmentId}) => {
            const sql = `   SELECT departments.name AS department,
                            CONCAT('$',SUM(r.salary)) AS totalBudget
                            FROM employees e 
                            LEFT JOIN  roles r
                            ON e.role_id = r.id
                            LEFT JOIN departments
                            ON r.department_id = departments.id
                            WHERE r.department_id = ?
                        ;` 
            select(sql,departmentId);           
       })
    }

}

//To create a class of a role
class Role{

    async add(){
        const departments  = await get(`SELECT id AS value, name FROM departments`)
        const questions =   [
        // To set the name of the role
        {
            name : 'title',
            message: 'what is the name of the role?',
            type: 'input',
            validate: function(val){
                //Checks if the value is a valid string
                if(val.length){
                    return !/^-?[\d.]+(?:e-?\d+)?$/.test(val) || console.log(chalk.red('Please enter a valid string')) ;
                }
                return false
                                
                }
        },
        //To set the salary of the role
        {
        name: 'salary',
        message: 'what is the salary of the role?',
        type: 'input',
        validate:  function(val){
            //Checks if the value is a valid number
            if(val.length){
                return /^-?[\d.]+(?:e-?\d+)?$/.test(val) || console.log(chalk.red('Please enter a valid string')) ;
            }
            return false                    
        }
       
        },
        //department Id
        {
        name: 'departmentId',
        message: 'what department would you like to add to?',
        type: 'list',
        choices :  departments,
        }
       ]
            inquirer.prompt(questions)
            .then(({title,salary,departmentId}) => {
                const sql =  `INSERT INTO roles ( title , salary,department_id)VALUES (?,?,?)`;
                const department = departments.find(d => d.value === departmentId)
                const departmentName = department.name
                manipulateTable(sql,[title,salary,departmentId]);
                console.log(chalk.green(`\n Added new ${ title } role to the ${departmentName} department \n`));
            })
    }

    async delete(){
        const roles = await get(`SELECT id AS value, title AS name FROM roles`)
     
        const questions =  {
            name: 'roleId',
            message: 'what role do you wish to delete?',
            type: 'list',
            choices : roles
           };

        inquirer.prompt(questions)
            .then(({roleId}) => {
                const sql = `DELETE FROM roles WHERE id = ?`
                const role = roles.find(r => r.value === roleId)
                const roleName = role.name
                manipulateTable(sql,roleId)
                console.log( chalk.red(`\n The ${roleName} role has been deleted \n`));
            })
    }

    viewAll(){
        select(`SELECT * from roles`)
    }
}

//To create a class of an Employee
class Employee{
    viewAll(){
        const sql =  `SELECT e.id, e.first_name, e.last_name,
        CONCAT(m.first_name, ' ', m.last_name) AS manager_name,
        r.title AS role, r.salary,
        departments.name AS department
        FROM employees e 
         LEFT JOIN employees m
         ON e.manager_id = m.id
         LEFT JOIN  roles r
         ON e.role_id = r.id
         LEFT JOIN departments
         ON r.department_id = departments.id;
         `
        select(sql); 
    }

    async add(){
        const roles = await get(`SELECT id AS value, title AS name from roles`);
        const managers = await get(`SELECT id AS value, CONCAT(first_name, ' ' ,last_name)
                                    AS name
                                    FROM employees 
                                    WHERE manager_id IS NOT NULL`);
        managers.unshift({name: 'None', value: ''})

        const questions =  [ 
            //To set employee first name
            {
            name : 'firstName',
            message: 'Enter first name of the employee',
            type: 'input',
            validate: function(val){
                //Checks if the value is a valid string
                if(val.length){
                    return !/^-?[\d.]+(?:e-?\d+)?$/.test(val) || console.log(chalk.red('Please enter a valid string')) ;
                }
                return false
                                
                }
            },
            //To set employee last name
            {
            name : 'lastName',
            message: 'Enter last name of the employee',
            type: 'input',
            validate: function(val){
                //Checks if the value is a valid string
                if(val.length){
                    return !/^-?[\d.]+(?:e-?\d+)?$/.test(val) || console.log(chalk.red('Please enter a valid string')) ;
                }
                return false
                                
                }
            },
            //To set role ID
            {
            name : 'roleId',
            message: 'what is the role of the employee',
            type: 'list',
            choices: roles  
            },
            {
            name: 'managerId',
            message: 'what is your manager\'s name?',
            type: 'list',
            choices : managers
          }
         ];

        inquirer.prompt(questions)
        .then((
            {
                firstName,
                lastName,
                roleId,
                managerId
            }
        ) => {
         if(managerId){
          const sql = `INSERT INTO employees (first_name,last_name,role_id,manager_id)VALUES(?,?,?,?)`
          manipulateTable(sql,[firstName,lastName,roleId,managerId]);
          console.log(chalk.green(`\n Added ${firstName} ${lastName} to the list of employees \n`));

         }
         else{
         const sql = `INSERT INTO employees (first_name,last_name,role_id)VALUES(?,?,?)`
             manipulateTable(sql,[firstName,lastName,roleId]);
            console.log(chalk.green(`\n Added ${firstName} ${lastName} to the list of employees \n`));
         }
        })
    }

    async updateEmployeeRole(){

        const employees = await get(`SELECT id as value,CONCAT(first_name,' ',last_name)  AS name from employees`);
        const roles = await get(`SELECT id as value, title AS name from roles`);
        const questions = [
            {
            name : 'employeeId',
            message: 'what employee\'s role would you like to update?',
            type: 'list',
            choices: employees
            },
            {
            name : 'roleId',
            message: 'what role would you like to set?',
            type: 'list',
            choices: roles
            },
        
        ]
        
        inquirer.prompt(questions)
        .then(({employeeId, roleId}) => {
            const sql = `UPDATE employees
            SET role_id = ?
            WHERE id = ?;
            `;
            const employee= employees.find(e => e.value === employeeId);
            const employeeName = employee.name;
            const role = roles.find(r => r.value === roleId);
            const roleName = role.name
            manipulateTable(sql,[roleId,employeeId]);
            console.log(chalk.green(` \n You set ${employeeName}'s role to ${roleName} \n`))
    })
    }
    async updateEmployeeManager(){
     
        const employees = await get(`SELECT id as value,CONCAT(first_name,' ',last_name)  AS name from employees`);
        const managers = await get(`SELECT id AS value, CONCAT(first_name, ' ' ,last_name)
                                    AS name
                                    FROM employees 
                                    WHERE manager_id IS NOT NULL`);
        const questions = [
            {
            name : 'employeeId',
            message: 'what employee would you like to update?',
            type: 'list',
            choices: employees
            },
            {
            name : 'managerId',
            message: 'what new manager would you like to set?',
            type: 'list',
            choices: managers
            },
        
        ]
        
        inquirer.prompt(questions)
        .then(({employeeId, managerId}) => {
            const sql = `UPDATE employees
            SET manager_id = ?
            WHERE id = ?;
            `;
            const employee= employees.find(e => e.value === employeeId);
            const employeeName = employee.name;
            const manager = managers.find(m => m.value === managerId);
            const managerName = manager.name
            manipulateTable(sql,[managerId,employeeId]);
            console.log(chalk.green(` \n You set ${employeeName}'s manager to ${managerName} \n`))
    })
    }

    async delete(){
        const employees = await get(`SELECT id as value,CONCAT(first_name,' ',last_name)  AS name from employees`);
        const questions =  {
            name: 'employeeId',
            message: 'what role do you wish to delete?',
            type: 'list',
            choices : employees
           }


           inquirer.prompt(questions)
           .then(({employeeId}) => {
               const sql = `DELETE FROM employees WHERE id = ?`
               const employee = employees.find(e => e.value === employeeId)
               const employeeName = employee.name
               manipulateTable(sql,employeeId)
               console.log( chalk.red(`\n The ${employeeName} has been deleted from the employee table \n`));
           })
    }


}





    async viewEmployeeByManager(){
        const managers = await get(`SELECT id AS value, CONCAT(first_name, ' ' ,last_name)
                                    AS name
                                    FROM employees 
                                    WHERE manager_id IS NULL`);
            const questions = [
            {
                name : 'managerId',
                message: 'what manager\'s employee would you like to see',
                type: 'list',
                choices: managers
            }
            ]

            inquirer.prompt(questions)
            .then(({managerId}) => {
                const sql =`SELECT e.id,e.first_name,e.last_name,
                                r.title AS role, r.salary,
                                departments.name AS department
                                FROM employees e
                                LEFT JOIN  roles r
                                ON e.role_id = r.id
                                LEFT JOIN departments
                                ON r.department_id = departments.id
                                LEFT JOIN employees m
                                ON e.manager_id = m.id
                                WHERE m.id = ?
                                ;`

       select(sql,managerId);


   
  
    })

}


    async viewEmployeeByDepartment(){
        const departments  = await get(`SELECT id AS value, name FROM departments`);



figlet('Employee Tracker',function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
    promptFeatures();
});


        const questions = [
            {
                name : 'departmentId',
                message: 'what department\'s employee would you like to see',
                type: 'list',
                choices: departments
            }
            ]

            inquirer.prompt(questions)
            .then(({departmentId}) => {


       

        const sql =`SELECT e.id, e.first_name, e.last_name,
                    CONCAT(m.first_name, ' ', m.last_name) AS manager_name,
                    r.title AS role, r.salary,
                    departments.name AS department
                    FROM employees e 
                    LEFT JOIN employees m
                    ON e.manager_id = m.id
                    LEFT JOIN  roles r
                    ON e.role_id = r.id
                    LEFT JOIN departments
                    ON r.department_id = departments.id
                    WHERE r.department_id = ?
                    `
    
                    select(sql,departmentId);
    })

   }


}

//To initialize database creation and initialization of app
async function init() {
    const app = {};
  
    app.initializeDatabase = async function () {
      await createDatabase();
      await createTables();
      await seedTables();
    };

    app.initializeDatabase();

    figlet('Employee Tracker',function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
        promptFeatures();
        
    });
  
  }

init();