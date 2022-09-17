import Db from 'mysql2-async'
module.exports = new Db(  {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: process.env.SQL_SECRET || this.password,
});