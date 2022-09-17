
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
        const [rows] = await con.query(sql,params);
        console.log(cTable.getTable(rows));
        
    }

     #setSchema(){
            //Schema for the department table 
       const sql = `CREATE TABLE departments(
            id INTEGER AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(30) NOT NULL
          );`

        return this.queryDB(sql)

    }

    









    

    // async #insertData(sql,params){
    //     const pool = mysql.createPool({host:'localhost', user: 'root', database: this.dbName, password: process.env.SQL_SECRET || this.password,});
    //     const promisePool = pool.promise();
    //     await promisePool.query(sql,params);
    // }



        //store seed Department for employees
    //Refrences function to add each Department to the database 
    // #seedDepartments(){
    //     const sampleDepartmentData = ['Sales', 'Engineering','Finance','Legal']
    //     sampleDepartmentData.forEach(department => this.addDepartments(department))
    // }



      //Insert a Department to database
    // async addDepartments(params){
    //     const sql = `INSERT INTO departments(name)VALUES(?);`
    //     const pool = this.#createPool();
    //     // query database using promises
    //     await pool.query(sql,params);
    // }

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

