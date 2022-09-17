
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();


class department{
    constructor(dbName = 'employee_tracker'){
             this.dbName = dbName;
             this.#init();
            
    }

    async #init(){
       await this.#createDatabase();
       await this.#setSchema();
       await this.#seedDepartments();
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
        // console.log(cTable.getTable(rows));
        
    }

     #setSchema(){
            //Schema for the department table 
       const sql = `CREATE TABLE departments(
            id INTEGER AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(30) NOT NULL
          );`

        return this.queryDB(sql)

    }


    //store seed Department for employees
    //Refrences function to add each Department to the database 
    async #seedDepartments(){
        const sampleDepartmentData = ['Sales', 'Engineering','Finance','Legal']
        const sql = `INSERT INTO departments(name)VALUES(?);`
        sampleDepartmentData.forEach(async department => await this.queryDB(sql,department));
    }

    //Insert a Department to database
    async addDepartment(params){
        const sql = `INSERT INTO departments(name)VALUES(?);`
        // query database using promises
        await this.queryDB(sql,params);
    }

    //To view all departments
    async viewAllDepartments(){
        const con = this.#dataBaseConnection();
        const useDB = `USE ${this.dbName};`;

        await con.connect();
        await con.query(useDB);
        const [rows,fields] = await con.query('SELECT * FROM departments');
        const departments = cTable.getTable(rows);
        console.log(departments);
    }

    




    // deleteEmployees(){

    // }

    // async viewAllDepartments(){
    //     const pool = this.#createPool();
    //     const [rows] = await pool.query('SELECT * FROM departments');
    //     const departments = cTable.getTable(rows);
    //     console.log(departments);
    // }


}

const dept =  new department();

let num = 0
const departments = setInterval(() => {
           num += 1;
          
           if(num === 1) {
            dept.addDepartment(['Music']);

           }
           if(num == 3){
            dept.viewAllDepartments();
            clearInterval(departments);
           }

},1000)


