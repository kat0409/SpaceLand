const mysql = require('mysql');

//create a connection pool to connect db to the backend of the web app
const pool = mysql.createPool({
    host: 'space-land.mysql.database.azure.com',
    user: 'space_land2025',
    password: '$paceland25',
    database: 'spacelanddb25',
    connectionLimit: 10,
    ssl: {
        rejectUnauthorized: true,
    }
});

pool.getConnection((err, connection) => {
    if(err){
        console.error("Error connecting to the database:", err);
    }
    else{
        console.log("Database connection successful");
        connection.release();
    }
});

module.exports = pool;