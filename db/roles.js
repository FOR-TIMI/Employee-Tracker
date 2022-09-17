
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();


class Role{
    constructor(dbName = 'employee_tracker'){
             this.dbName = dbName;
             this.#init();
            
    }

    async #init(){
       await this.#createDatabase();
       await this.#setSchema();
       await this.#seedRoles();
    }

    #dataBaseConnection(){
        const con = mysql.createConnection(
            {
                host: 'localhost',
                // Your MySQL username,
                user: 'root',
                // Your MySQL password
                password: process.env.SQL_SECRET || this.password,
            });
            return con.promise();
    }

    async #createDatabase(){
        const con  = this.#dataBaseConnection()
        await con.connect();
        await con.query(`DROP DATABASE IF EXISTS ${this.dbName};`)
        await con.query(`CREATE DATABASE ${this.dbName};`);
        console.log('Database created')
    }

    async queryDB(sql, params = ''){
        const con = this.#dataBaseConnection();
        const useDB = `USE ${this.dbName};`;

        await con.connect();
        await con.query(useDB);
        const [rows,fields] = await con.query(sql,params);
    }

     #setSchema(){
        //Schema for the role table 
        const sql = `CREATE TABLE roles( 
        id INTEGER AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(30) NOT NULL,
        salary DECIMAL NOT NULL,
        department_id INTEGER, 
        FOREIGN KEY (department_id) REFERENCES roles(id) ON DELETE SET NULL
        );`

       return this.queryDB(sql)
     }


    //store seed roles for employees
    //Refrences function to add each roles to the database 
    async #seedRoles(){
 
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

    //Insert a roles to database
    async addRole(params){
        const sql = `INSERT INTO roles(name)VALUES(?);`
        // query database using promises
        await this.queryDB(sql,params);
    }

    //To view all roles
    async viewAllRoles(){
        const con = this.#dataBaseConnection();
        const useDB = `USE ${this.dbName};`;

        await con.connect();
        await con.query(useDB);
        const [rows,fields] = await con.query('SELECT * FROM roles');
        const roles = cTable.getTable(rows);
        console.log(roles);
    }

    




    // deleteEmployees(){

    // }

    // async viewAllroles(){
    //     const pool = this.#createPool();
    //     const [rows] = await pool.query('SELECT * FROM roles');
    //     const roles = cTable.getTable(rows);
    //     console.log(roles);
    // }


}

const role =  new Role();

let num = 0
const roles = setInterval(() => {
           num += 1;
          
           if(num === 1) {
            dept.addDepartment(['Music']);

           }
           if(num == 3){
            dept.viewAllroles();
            clearInterval(roles);
           }

},1000)


