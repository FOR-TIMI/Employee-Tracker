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
         console.log(answers);
         })
     }
 }