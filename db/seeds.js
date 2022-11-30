const { query } = require('../utils/helper')


async function seedTables(){
    const app  = {}


    
    app.setSeedData = async function(){
        await app.seedDepartments()
        await app.seedRoles()
        await app.seedEmployees()
     }
 
  
      //store seed Department for employees
     //Refrences function to add each Department to the database 
     app.seedDepartments =   async function(){
         const sampleDepartmentData = ['Sales', 'Engineering','Finance','Legal']
         const sql = `INSERT INTO departments(name)VALUES(?);`
         sampleDepartmentData.forEach(async (department) => await query(sql,department));
     }
    
       //Insert a roles to database
    app.seedRoles = async function(){
        const sql =  `INSERT INTO roles ( title , salary,department_id)VALUES (?,?,?)`;
        const sampleRoleData = [
            {title:'Sales Lead', salary:100000,department_id:4 },
            {title:'SalesPerson', salary:300000,department_id:4 },
            {title:'Lead Engineer', salary:500000,department_id:1},
            {title:'Software Engineer', salary:600000,department_id:1 },
            {title:'Account Manager', salary:450000,department_id:2 },
            {title:'Accountant', salary:364000,department_id:2 },
            {title:'Legal Team Lead', salary:424000,department_id:3 },
            {title:'Lawyer', salary:700000,department_id:3 },
        ]


        // query database using promises
        sampleRoleData.forEach(async role => await query(sql,[role.title,role.salary,role.department_id]))   
    }

    app.seedEmployees = async function(){
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

        sampleEmployeeData.forEach(async e => {
               await query(sql,[e.first,e.last,e.roleId,e.managerId])
        })
    }

  
  
  
     return await app.setSeedData();


}


module.exports = seedTables