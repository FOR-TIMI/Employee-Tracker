const {select,manipulateTable, promptFeatures} = require('../utils/helper');
const inquirer = require('inquirer');
const chalk = require('chalk')

class Department{

 
 
  get #questions(){
    return [{
        name : 'department_name',
        message: 'What department do you wish to add?',
        type : 'input',
        validate: function(val){
            if(val.length && typeof val === 'string'){
                return true
            }
            else{
                console.log(chalk.red('Please enter a valid string'))
                return false
            }
        }
        
    },[{
        name : 'newDepartmentName',
        message: 'what is the id of the department you want to update?',
        type : 'input',
        validate: function(val){
            if(val.length && typeof val === 'string'){
                return true
            }
            else{
                console.log(chalk.red('Please enter a valid Number'));
                return false;
            }
        }

    },{
        name : 'departmentId',
        message: 'what changes would you like to add',
        type : 'input',
        validate: function(val){
            if(val.length && typeof val !== 'number'){
                return true
            }
            else{
                console.log(chalk.red('Please enter a valid string'));
                return false;
            }
        }

    }
]
 ]
  }



  viewAll(){
    select(`SELECT * FROM departments`); 
   }

    insert(){
        const question = this.#questions[0];
         inquirer.prompt(question)
         .then(answers=> {
            const sql = `INSERT INTO departments(name)VALUES(?);`
            manipulateTable(sql,answers.department_name);
            promptFeatures();
         })

     };
 



   update(){
        const questions = this.#questions[1];

        inquirer.prompt(questions)
        .then(answers => {
            const sql = `UPDATE departments
            SET name = ?
            WHERE id = ?;
           `
           manipulateTable(sql,[answers.departmentId,answers.newDepartmentName])           
        })

   }


   delete(id){
         if(typeof id === 'number'){
            const sql = `DELETE FROM departments WHERE id = ?` 
            manipulateTable(sql,id);
            return;
         }
         else{
           promptFeatures();
         }
   }

}

module.exports = new Department()




