
const createDatabase = require('./db/db.js');
const seedTables = require('./db/seeds.js');
const createTables = require('./db/schemas.js');
const { promptFeatures } = require('./utils/helper');



function initializeDatabase(){
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
         
      }
      
      

    app.initializeDatabase();
    // app.selectOption();

}


initializeDatabase();
promptFeatures();

