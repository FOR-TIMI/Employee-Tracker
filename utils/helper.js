const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
const {config} = require('../db/config')

require('dotenv').config();



const connection = async function(){
    return mysql.createConnection(config); 
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

