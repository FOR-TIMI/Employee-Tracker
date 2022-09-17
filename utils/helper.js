const mysql = require('mysql2');
require('dotenv').config();


const connection = async function(){
    return mysql.createConnection(
        {
            host: 'localhost',
            // Your MySQL username,
            user: 'root',
            // Your MySQL password
            password: process.env.SQL_SECRET,
            //The database name
            database: 'employee_tracker'
        })
     
}


const query = async function(sql,params){
    const db = await connection();
     db.connect();
     db.query(`USE employee_tracker;`);
    if(params){
        db.query(`SET FOREIGN_KEY_CHECKS = 0;`)
        db.query(sql,params);
    }
    else{
        db.query(sql);
    }

   

}



module.exports = {query};

