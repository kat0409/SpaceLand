require('dotenv').config();
const mysql = require('mysql2');
const nodemailer = require('nodemailer');

const pool  = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
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

async function sendLowStockNotifications() {
    try {
        const [notifications] = await pool.query(`
            SELECT ln.notificationID, ln.merchandiseID, m.itemName, s.email
            FROM low_stock_notifications ln
            JOIN merchandise m ON ln.merchandiseID = m.merchandiseID
            JOIN supervisors s ON ln.supervisorID = s.SupervisorID
            WHERE ln.sent = FALSE;
        `);

        for (const notification of notifications) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: notification.email,
                subject: 'Low Stock Alert: Order More Inventory',
                text: `The item "${notification.itemName}" is running low. Please reorder.`
            };

            await transporter.sendMail(mailOptions);

            await pool.query(`UPDATE low_stock_notifications SET sent = TRUE WHERE notificationID = ?`, [notification.notificationID]);
        }

        console.log('Low stock emails sent successfully.');
    } catch (error) {
        console.error('Error sending low stock emails:', error);
    }
}

//The function will run every ten minutes to keep updates as frequent as possible
setInterval(sendLowStockNotifications, 600000);