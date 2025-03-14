require('dotenv').config();
const mysql = require('mysql2');
const nodemailer = require('nodemailer');

const pool  = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.send.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

