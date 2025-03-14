require('dotenv').config();

const mysql = require('mysql2');
//const fs = require('fs');
//const path = require('path');

/*const pool = mysql.createPool({
    host: 'space-land.mysql.database.azure.com',
    user: 'space_land2025',         
    password: '$paceland25',          
    database: 'spacelanddb25',    
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: true,
        //ca: fs.readFileSync(path.join(__dirname, 'BaltimoreCyberTrustRoot.crt.pem')) // Path to CA certificate
    }
});*/

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT,
//     connectionLimit: 10,
//     ssl: {
//         rejectUnauthorized: true
//     }
// });
const pool = mysql.createPool
(
    {
        host: "localhost",
        user: "root",
        password: "@@2104Yi$A",
        database: "groupDB",
        port: 3306,
        connectionLimit: 10,
        // ssl:
        // {
        //     rejectUnauthorized: true
        // }
    }
)

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Database connection successful');
        connection.release();
    }
});

module.exports = pool;