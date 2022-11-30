//Configuration for my sql connection
const config =  {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: process.env.SQL_SECRET,
    //The database name
    database: 'employee_tracker'
}



const dbConfig =    {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: process.env.SQL_SECRET || this.password,
}

module.exports = { dbConfig, config}