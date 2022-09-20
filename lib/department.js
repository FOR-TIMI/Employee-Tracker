const inquirer = require('inquirer');
const chalk = require('chalk');
const mysql = require('mysql2');
require('dotenv').config();
const cTable = require('console.table');



const config =  {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: process.env.SQL_SECRET,
    //The database name
    database: 'employee_tracker'
}

const select =async function(sql){
    const pool = mysql.createPool(config).promise();
    const [rows] = await pool.query(sql);
    const data = cTable.getTable(rows);
    console.log('\n', chalk.blue(data));
    promptFeatures();
   
};

const get = async function(sql){
    const pool = mysql.createPool(config).promise();
    const [rows] = await pool.query(sql);
    return rows
}

const manipulateTable = async function(sql,params){
    const pool = mysql.createPool(config).promise();
    await pool.query(sql,params);
    promptFeatures();    
};
   
const promptFeatures =  function(){
    const d = new Department();
    const r = new Role();
    const e= new Employee();
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
                   'Update Employee Role',
                   'Update department',
                   'Delete department'
                    ]
       }
   ]).then((answer) => {
       switch(answer.option){
           case 'View All Departments' : d.viewAll();
           break;
           case 'View All Roles':  r.viewAll();
           break;
           case 'View All Employees': e.viewAll();
           break;
           case 'Add Department': d.insert();
           break;
           case 'Add Role': r.add();
           break;
           case 'Add Employee': e.add();
           break;
           case 'Update Employee Role': ;
           break;
           case 'Update department': d.update();
           break;
           case 'Delete department': d.delete();
           break;
       }
      
   }) 
   }

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
            console.log( chalk.green(`\n added ${answers.departmentName} to the database \n`))
            manipulateTable(sql,answers.departmentName);
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
           console.log(chalk.green(`\n ${oldDepartmentName} now set to ${newDepartmentName} \n`))
           manipulateTable(sql,[newDepartmentName,departmentId])    
                 
        })

   }


   async delete(){
         const departments = await get(`SELECT id AS value, name FROM departments`);
         const questions = [{
            name : 'departmentId',
            message: 'What department do you wish to delete?',
            type : 'list',
            choices: departments
          }]

         inquirer.prompt(questions)
         .then(({departmentId}) => {
             const sql = `DELETE FROM departments WHERE id = ?` 
             const deletedDepartment = departments.find(d => d.value === departmentId)
             const deletedDepartmentName = deletedDepartment.name
             console.log(chalk.red(`\n The ${deletedDepartmentName} department was deleted \n`))
            manipulateTable(sql,departmentId);           
         })
    }

}

class Role{
    get #questions(){

        return [
        
    

    [
        {
            name: 'roleId',
            message: 'Enter the id of the role you wish to delete',
            type: 'input',
            choices : function(val){
                //Checks if the value is a valid number
                if(val.length){
                    return /^-?[\d.]+(?:e-?\d+)?$/.test(val) || console.log(chalk.red('Please enter a valid string')) ;
                }
                return false
                                
               }
           }
    ]
    ] 
    }

    async add(){
        const departments  = await get(`SELECT * FROM departments`)
        const questions =   [{
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
       {
        name: 'department_id',
        message: 'what department would you like to add to?',
        type: 'list',
        choices :  departments,
       }
            ]
            inquirer.prompt(questions)
            .then(answers => {
                const sql =  `INSERT INTO roles ( title , salary,department_id)VALUES (?,?,?)`;
                const {title,salary,department_id}  = answers
                manipulateTable(sql,[title,salary,department_id]);
            })
    }

    delete(){
        const questions = this.#questions[1];
            inquirer.prompt(questions)
            .then(answers => {
                const sql = `DELETE FROM roles WHERE id = ?`
                manipulateTable(sql,answers.roleId)
            })
    }

    viewAll(){
        select(`SELECT * from roles`)
    }
}

class Employee{
   get #questions(){
        return [
           
    
        [
            {
                name: 'employeeId',
                message: 'which employee\'s role would you like to update?',
                type: 'list',
                choices : getEmployees()
            },
            {
                name: 'role',
                message: 'which role would you like to set?',
                type: 'list',
                choices : getRoles()
            }
        ]
        ] 
        
    }

    viewAll(){
        const sql =  `SELECT e.id, e.first_name, e.last_name,
        m.first_name AS manager_name,
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
        const roles = await get(`SELECT title from roles`);
        const roleChoices = roles.map((employee) => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            }
        }
            )
        const managers = await get(`SELECT * FROM employees WHERE manager_id = NULL`);
        const questions =  [ {
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
         {
            name : 'roleId',
            message: 'what is the role of the employee',
            type: 'list',
            choices: roleChoices  
        },
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
       {
        name: 'manager',
        message: 'what is your manager\'s name?',
        type: 'list',
        choices : managers
       }
    ];

        inquirer.prompt(questions)
        .then(answers => {
        //  const sql = `INSERT INTO employees (first_name,last_name,role_id,manager_id)VALUES(?,?,?,?)`
        //  const {firstName,lastName,roleId,managerId} = answers;
        //  manipulateTable(sql,[firstName,lastName,roleId,managerId]);
        console
        })
    }
}


// async function init(){
//     const roles = await get(`SELECT id,title from roles`);
//     console.log(roles);
//   };

//   init()

promptFeatures();
// const deparments = get(`Select * from departments`);
// console.log(deparments)







