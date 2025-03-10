const mysql = require('mysql2');

//create a connection pool to connect db to the backend of the web app
const pool = mysql.createPool({
    host: 'space-land.mysql.database.azure.com',
    user: 'space_land2025',
    password: '$paceland25',
    database: 'space_land_25',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;