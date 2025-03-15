const { stringify } = require('qs');
const pool = require('./db.js');
const queries = require('./queries.js');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',//Do i need to make a fake supervisor email?
        pass: 'your-email-password', //Do i need to make a fake supervisor email password?
    },
});

// Function to send email notification
const sendNotification = async (supervisorEmail, itemName) => {
    const mailOptions = {
        from: 'your-email@gmail.com',//modify this later
        to: supervisorEmail,
        subject: 'Low Stock Alert',
        text: `The item "${itemName}" has reached 0 quantity. Please order more.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Notification sent successfully.');
        return true;
    } catch (error) {
        console.error('Error sending notification:', error);
        return false;
    }
};

// Function to check for unsent notifications and send emails
const checkAndSendNotifications = async () => {
    try {
        // Fetch unsent notifications
        const [notifications] = await pool.query(queries.getUnsentNotifications);

        // Fetch supervisor email
        const [supervisor] = await pool.query(queries.getSupervisorEmailByDepartment);
        const supervisorEmail = supervisor[0].email;

        // Process each notification
        for (const notification of notifications) {
            const { notificationID, merchandiseID, itemName } = notification;

            // Send notification
            const emailSent = await sendNotification(supervisorEmail, itemName);

            // Mark notification as sent
            if (emailSent) {
                await pool.query(queries.markNotificationAsSent, [notificationID]);
            }
        }
    } catch (error) {
        console.error('Error processing notifications:', error);
    }
};

//Fetch all rides
const getRides = (request, response) => {
    pool.query(queries.getRides, (error, results) => {
        if(error){
            console.error("Error fetching rides:", error);
            response.writeHead(500, {'Content-Type': "application/json"});
            response.end(JSON.stringify({error: "Internal server error"}));
            return;
        }
        response.writeHead(200, {"Content-Type": "application/json"});
        response.end(JSON.stringify(results));
    });
};

//Fetch all employees
const getEmployees = (request, response) => {
    pool.query(queries.getEmployees, (error, results) => {
        if (error){
            console.error("Error fetching employees:", error);
            response.writeHead(500, {"Content-Type": "application/json"});
            response.end(JSON.stringify({error: "Internal server error"}));
            return;
        }
        response.writeHead(200, {"Content-Type": "application/json"});
        response.end(JSON.stringify(results));
    });
};

//Add an employee to the database
const addEmployee = (request, response) => {
    let body = "";

    request.on("data", (chunk) => {
        body += chunk.toString();
    });

    request.on("end", () => {
        let parsedBody;
        try {
            parsedBody = JSON.parse(body);
        } catch (error) {
            response.writeHead(400, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ error: "Invalid JSON format" }));
            return;
        }

        // Get employee details from request body
        const { FirstName, LastName, Email, Address, SupervisorID, username, password, Department, employmentStatus, dateOfBirth } = parsedBody;

        // Validate required fields
        if (!FirstName || !LastName || !Email || !Address || !SupervisorID || !username || !password || !Department || !employmentStatus || !dateOfBirth) {
            response.writeHead(400, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ error: "All fields are required" }));
            return;
        }

        console.log("Checking if SupervisorID exists:", SupervisorID);

        // Check if the provided SupervisorID exists in `supervisors`
        pool.query('SELECT * FROM supervisors WHERE SupervisorID = ?', [SupervisorID], (error, results) => {
            if (error) {
                console.error("Error verifying SupervisorID:", error);
                response.writeHead(500, { "Content-Type": "application/json" });
                response.end(JSON.stringify({ error: "Internal server error" }));
                return;
            }

            if (results.length === 0) {
                console.log("SupervisorID not found:", SupervisorID);
                response.writeHead(400, { "Content-Type": "application/json" });
                response.end(JSON.stringify({ error: `Supervisor with ID ${SupervisorID} does not exist` }));
                return;
            }

            // Insert the new employee into the database
            pool.query(
                'INSERT INTO employee (FirstName, LastName, Email, Address, SupervisorID, username, password, Department, employmentStatus, dateOfBirth) VALUES (?,?,?,?,?,?,?,?,?,?)',
                [FirstName, LastName, Email, Address, SupervisorID, username, password, Department, employmentStatus, dateOfBirth],
                (error, results) => {
                    if (error) {
                        console.error("Error adding employee:", error);
                        response.writeHead(500, { "Content-Type": "application/json" });
                        response.end(JSON.stringify({ error: "Internal Server Error" }));
                        return;
                    }

                    response.writeHead(201, { "Content-Type": "application/json" });
                    response.end(JSON.stringify({ message: "Employee added successfully", EmployeeID: results.insertId }));
                }
            );
        });
    });
};

//Fetch the rides that need maintenance
const getRidesNeedingMaintenance = (request, response) => {
    pool.query(queries.getRidesNeedingMaintenance, (error, results) => {
        if(error) {
            console.error("Error fetching rides needing maintenance:", error);
            response.writeHead(500, {"Content-Type": "application/json"});
            response.end(JSON.stringify({error: "Internal server error"}));
            return;
        }
        response.writeHead(200, {"Content-Type": "application/json"});
        response.end(JSON.stringify(results));
    });
};

//add a maintenance job to the database
const addMaintenance = (request, response) => {
    let body = "";

    request.on("data", (chunk) => {
        body += chunk.toString();
    });

    request.on("end", () => {
        const {MaintenanceID, RideID, MaintenanceStartDate, MaintenanceEndDate, MaintenanceEmployeeID, eventID} = JSON.parse(body);

        if(!MaintenanceID || !RideID || !MaintenanceStartDate || !MaintenanceEndDate || !MaintenanceEmployeeID){
            response.writeHead(400, {"Content-Type": "application/json"});
            response.end(JSON.stringify({error: "MaintenanceID, RideID, MaintenanceStartDate, MaintenanceStartDate, MaintenanceEndDate, and MaintenanceEmployeeID are all required"}));
            return;
        }

        pool.query(queries.addMaintenance, [MaintenanceID, RideID, MaintenanceStartDate, MaintenanceStartDate, MaintenanceEndDate, MaintenanceEmployeeID], (error, results) => {
            if (error){
                console.error("Error adding maintenance record:", error);
                response.writeHead(500, {"Content-Type": "application/json"});
                response.end(JSON.stringify({error: "Internal server error"}));
                return;
            }
            response.writeHead(201, {"Content-Type": "application.json"});
            response.end(JSON.stringify({message: "Maintenance record added successfully"}));
        });
    });
};

const getMerchandiseTransactions = (request, response) =>{
    pool.query(queries.getMerchandiseTransactions, (error, results) => {
        if(error) {
            console.error("Error fetching transactions made in the gift shop:", error);
            response.writeHead(500, {"Content-Type": "application/json"});
            response.end(JSON.stringify({error: "Internal server error"}));
            return;
        }
        response.writeHead(200, {"Content-Type": "application/json"});
        response.end(JSON.stringify(results));
    });
};

const loginVisitor = (req, res) => {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        let parsedBody;
        try {
            parsedBody = JSON.parse(body);
        } catch (err) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid JSON format" }));
            return;
        }

        const { username, password } = parsedBody;

        if (!username || !password) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Username and password are required" }));
            return;
        }

        pool.query(queries.authenticateVisitor, [username, password], (err, results) => {
            if (err) {
                console.error("Error querying loginVisitor:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal server error" }));
                return;
            }

            if (results.length === 0) {
                res.writeHead(401, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid credentials" }));
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    message: "Login successful",
                    visitorID: results[0].VisitorID
                }));
            }
        });
    });
};

//Add a visitor
const addVisitor = (req, res) => {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        let parsedBody;
        try {
            parsedBody = JSON.parse(body);
        } catch (error) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid JSON format" }));
            return;
        }

        const {
            FirstName, LastName, Phone, Email, Address, DateOfBirth, 
            AccessibilityNeeds, Gender, Username, Password, Height, Age, MilitaryStatus
        } = parsedBody;

        if (!FirstName || !LastName || !Email || !Username || !Password || !DateOfBirth) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "First name, last name, email, username, password, and date of birth are required." }));
            return;
        }

        // Ensure optional fields have defaults
        const phone = Phone || null;
        const address = Address || null;
        const gender = Gender || null;
        const height = Height || null;
        const age = Age || null;

        // Set checkboxes as 1 (true) if checked, else 0 (false)
        const accessibilityNeeds = AccessibilityNeeds ? 1 : 0;
        const militaryStatus = MilitaryStatus ? 1 : 0;

        pool.query(queries.checkVisitorExists, [Username], (error, results) => {
            if (error) {
                console.error("Error checking existing visitor:", error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal server error" }));
                return;
            }

            if (results.length > 0) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Username already exists" }));
                return;
            }

            pool.query(
                queries.addVisitor,
                [FirstName, LastName, phone, Email, address, DateOfBirth, accessibilityNeeds, gender, Username, Password, height, age, militaryStatus],
                (error, results) => {
                    if (error) {
                        console.error("Error adding visitor:", error);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Internal server error" }));
                        return;
                    }

                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Visitor account created successfully", VisitorID: results.insertId }));
                }
            );
        });
    });
};

const checkVisitorExists = (req, res) => {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        let parsedBody;
        try {
            parsedBody = JSON.parse(body);
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
            return;
        }

        const { username } = parsedBody;

        if (!username) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Username required' }));
            return;
        }

        pool.query(queries.checkVisitorExists, [username], (err, results) => {
            if (err) {
                console.error('Error querying checkVisitorExists:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error' }));
                return;
            }

            if (results.length > 0) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ exists: true }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ exists: false }));
            }
        });
    });
};

const purchasePass = ((req,res) => {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        let parsedBody;
        try {
            parsedBody = JSON.parse(body);
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON format' }));
            return;
        }

        const { VisitorID, ticketType, price } = parsedBody;

        if (!VisitorID || !ticketType || !price) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'VisitorID, PassType, and Price are required.' }));
            return;
        }

        pool.query(queries.purchasePass, [ticketType, price, VisitorID], (err, results) => {
            if (err) {
                console.error('Error purchasing pass:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error' }));
                return;
            }

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Pass purchased successfully', TicketID: results.insertId }));
        });
    });
});
const getEmployeesByDept = (req, res) => {
    const { department } = req.query;
    pool.query(queries.getEmployeesByDepartment, [department], (error, results) => {
        if (error) {
            console.error("Error fetching employees by department:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
};
const getMaintenanceRequests = (req, res) => {
    pool.query(queries.getMaintenanceRequests, (error, results) => {
        if (error) {
            console.error("Error fetching maintenance requests:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
};
const updateMaintenanceStatus = (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        let parsedBody;
        try {
            parsedBody = JSON.parse(body);
        } catch (error) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid JSON format" }));
            return;
        }

        const { maintenanceID, status } = parsedBody;

        pool.query(queries.updateMaintenanceStatus, [status, maintenanceID], (error, results) => {
            if (error) {
                console.error("Error updating maintenance status:", error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal server error" }));
                return;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Maintenance status updated successfully" }));
        });
    });
};
const getLowStockMerchandise = (req, res) => {
    pool.query(queries.getLowStockMerchandise, (error, results) => {
        if (error) {
            console.error("Error fetching low stock merchandise:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
};
const getSalesReport = (req, res) => {
    pool.query(queries.getSalesReport, (error, results) => {
        if (error) {
            console.error("Error fetching sales report:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
};
const getTicketSales = (req, res) => {
    pool.query(queries.getTicketSales, (error, results) => {
        if (error) {
            console.error("Error fetching ticket sales:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
};
const getVisitorRecords = (req, res) => {
    pool.query(queries.getVisitorRecords, (error, results) => {
        if (error) {
            console.error("Error fetching visitor records:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
};

const getUserInfo = (req, res) => {
    let body = "";

    req.on
    (
        "data", 
        chunk =>
        {
            body += chunk.toString();
        }
    )
    req.on(
        "end",
        () =>
        {
            let parsedBody;
            try
            {
                parsedBody = JSON.parse(body);
            }
            catch (error)
            {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON format" }));
                return;
            }
            const visitorId = parsedBody.visitorID;

            //console.log(req);
            pool.query(queries.getUserInfo, [visitorId], (error, results) => {
            if (error) {
                console.error("Error fetching visitor records:", error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal server error" }));
                return;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(results[0]));
            });
        }
    )
};


//Check to see if you need to make a module.exports function here as well
module.exports = {
    getRides,
    getEmployees,
    addEmployee,
    getRidesNeedingMaintenance,
    addMaintenance,
    getMerchandiseTransactions,
    checkAndSendNotifications,
    loginVisitor,
    addVisitor,
    checkVisitorExists,
    purchasePass,
    getUserInfo
};