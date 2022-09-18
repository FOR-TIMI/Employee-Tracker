const mysql = require('mysql2');
const cTable = require('console.table');
const sql = require('./db/sql');


const createDatabase = require('./db/db');
const seedTables = require('./db/seeds');
const createTables = require('./db/schemas');
const { promptFeatures } = require('./utils/helper');




function init(){
    const app = {};



    app.initializeDatabase = async function(){
        const database = await new Promise(function (fulfill, reject) {
            //create database
            fulfill(createDatabase());
        });
        const tables = await new Promise(function (fulfill_1, reject_1) {
            //create table
            fulfill_1(createTables());
        });
        const seeds =  await new Promise(function (fulfill_2, reject_2) {
            //add sample data to tables
            fulfill_2(seedTables());
        });
       await new Promise(function (fulfill_2, reject_2) {
            //add sample data to tables
            promptFeatures();
        });
      }
      
      

    app.selectOption = function(){
       

    }


    app.initializeDatabase();
    // app.selectOption();

}


init();