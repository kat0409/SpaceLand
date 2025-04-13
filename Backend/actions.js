const { stringify } = require('qs');
const pool = require('./db.js');
const queries = require('./queries.js');
const mysql = require("mysql2");

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

        const { FirstName, LastName, Email, Address, SupervisorID, username, password, Department, employmentStatus, dateOfBirth } = parsedBody;

        if (!FirstName || !LastName || !Email || !Address || !SupervisorID || !username || !password || !Department || !employmentStatus || !dateOfBirth) {
            response.writeHead(400, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ error: "All fields are required" }));
            return;
        }

        console.log("Checking if SupervisorID exists:", SupervisorID);

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

const addMerchandiseTransaction = (req,res) => {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        const {merchandiseID, VisitorID, transactionDate, quantity, totalAmount} = JSON.parse(body);

        if (!merchandiseID || !VisitorID || !transactionDate || !quantity ||!totalAmount){
            res.writeHead(400, {"Content-Type":"application/json"});
            res.end(JSON.stringify({error: "merchandiseID, VisitorID, transactionDate, quantity, totalAmount are required fields"}));
            return;
        }

        pool.query(queries.addMerchandiseTransaction, [merchandiseID, VisitorID, transactionDate, quantity, totalAmount], (error, results) => {
            if (error){
                console.error("Error adding merchandise transaction:", error);
                res.writeHead(500, {"Content-Type": "application/json"});
                res.end(JSON.stringify({error: "Internal server error"}));
                return;
            }
            res.writeHead(201, {"Content-Type": "application/json"});
            res.end(JSON.stringify({message: "Merchandise transaction added successfully."}));
        });
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

//login employee
const loginEmployee = (req, res) => {
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
            res.end(JSON.stringify({ error: "Username and password are required fields" }));
            return;
        }

        pool.query(queries.authenticateEmployee, [username, password], (err, results) => {
            if (err) {
                console.error("Error querying loginEmployee:", err);
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
                    employeeID: results[0].EmployeeID,//check later
                    //role: "employee"
                }));
            }
        });
    });
};

//login supervisor
const loginSupervisor = (req, res) => {
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
            res.end(JSON.stringify({ error: "Username and password are required fields" }));
            return;
        }

        pool.query(queries.authenticateSupervisor, [username, password], (err, results) => {
            if (err) {
                console.error("Error querying loginSupervisor:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal server error" }));
                return;
            }

            if (results.length === 0) {
                res.writeHead(401, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid credentials" }));
            } else {
                const { SupervisorID, departmentIDNumber, departmentName } = results[0];

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    message: "Login successful",
                    supervisorID: SupervisorID,
                    departmentIDNumber: departmentIDNumber,
                    departmentName: departmentName
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
        const phone = Phone || 'N/A';
        const address = Address || 'N/A';
        const gender = Gender || 'U';
        const height = Height || 0;
        const age = Age || 0;

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

const purchaseCosmicPass = (req, res) => {
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

        const { VisitorID, quantity, price } = parsedBody; 

        if (!VisitorID || !quantity || !price) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid input. Must include VisitorID, quantity, and price.' }));
            return;
        }

        const totalAmount = quantity * price;
        const ticketType = "Cosmic";

        pool.query(queries.createTransaction, [VisitorID, quantity, totalAmount, ticketType], (err, transactionResult) => {
            if (err) {
                console.error('Error creating transaction:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error' }));
                return;
            }

            const transactionID = transactionResult.insertId;

            const ticketValues = [];
            for (let i = 0; i < quantity; i++) {
                ticketValues.push([price, new Date(), transactionID, ticketType]);  // Removed detailID
            }

            pool.query(queries.insertTickets, [ticketValues], (err) => {
                if (err) {
                    console.error('Error inserting tickets:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal server error' }));
                    return;
                }

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Cosmic Tickets purchased successfully', transactionID }));
            });
        });
    });
};

const purchaseGeneralPass = (req, res) => {
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

        const { VisitorID, quantity, price } = parsedBody; 

        if (!VisitorID || !quantity || !price) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid input. Must include VisitorID, quantity, and price.' }));
            return;
        }

        const totalAmount = quantity * price;
        const ticketType = "General";

        pool.query(queries.createTransaction, [VisitorID, quantity, totalAmount, ticketType], (err, transactionResult) => {
            if (err) {
                console.error('Error creating transaction:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error' }));
                return;
            }

            const transactionID = transactionResult.insertId;

            const ticketValues = [];
            for (let i = 0; i < quantity; i++) {
                ticketValues.push([price, new Date(), transactionID, ticketType]);  // Removed detailID
            }

            pool.query(queries.insertTickets, [ticketValues], (err) => {
                if (err) {
                    console.error('Error inserting tickets:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal server error' }));
                    return;
                }

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'General Tickets purchased successfully', transactionID }));
            });
        });
    });
};

const url = require('url');

const getEmployeesByDept = (req, res) => {
    const parsedUrl = url.parse(req.url, true); 
    const { department } = parsedUrl.query; 

    if (!department) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Missing 'department' query parameter" }));
        return;
    }

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

        const { maintenanceID, status, startDate, endDate } = parsedBody;

        if (!maintenanceID || status === undefined) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "MaintenanceID and status are required" }));
            return;
        }

        // Update Ride MaintenanceStatus first
        pool.query(queries.updateRideMaintenanceStatus, [status, maintenanceID], (error, results) => {
            if (error) {
                console.error("Error updating ride maintenance status:", error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal server error" }));
                return;
            }

            console.log("Ride MaintenanceStatus updated successfully");

            // If startDate and endDate are provided, update maintenance table
            if (startDate && endDate) {
                pool.query(queries.updateMaintenanceDates, [startDate, endDate, maintenanceID], (error, results) => {
                    if (error) {
                        console.error("Error updating maintenance dates:", error);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Internal server error" }));
                        return;
                    }

                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Maintenance status and dates updated successfully" }));
                });
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Maintenance status updated successfully" }));
            }
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

//Reports
const rideMaintenanceReport = (req, res) => {
    //const { startDate, endDate, rideID } = req.query;
    const parsedUrl = url.parse(req.url, true);
    let { startDate, endDate, rideID } = parsedUrl.query || {};

    startDate = startDate || '1970-01-01';
    endDate = endDate || '2100-01-01';
    rideID = parseInt(rideID) || 0;

    pool.query(
        queries.rideMaintenanceReport,
        [startDate, endDate, rideID, rideID],
        (error, results) => {
            if (error) {
                console.error("Error fetching ride maintenance report:", error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal server error" }));
                return;
            }

            if (!results || results.length === 0) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "No maintenance data found" }));
                return;
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(results));
        }
    );
};

const visitorPurchasesReport = (req,res) => {
    const parsedUrl = require('url'). parse(req.url, true);
    const {
        startDate,
        endDate,
        ticketType,
        visitorName,
        minSpent,
        maxSpent,
        purchaseType,
        merchandiseItem
    } = parsedUrl.query;

    let query = queries.visitorPurchasesReport
    const conditions = [];
    const params = [];
    
    if (ticketType){
        conditions.push(`tt.ticketType = ?`);
        params.push(ticketType);
    }

    if(visitorName){
        conditions.push(`CONCAT(v.FirstName, ' ', v.LastName) LIKE ?`);
        params.push(`%${visitorName}`);
    }

    if(startDate){
        conditions.push(`(tt.transactionDate >= ? OR mt.transactionDate >= ?)`);
        params.push(startDate, startDate);
    }

    if (endDate){
        conditions.push(`(tt.transactionDate <= ? OR mt.transactionDate <= ?)`);
        params.push(endDate, endDate);
    }

    if(minSpent){
        conditions.push(`(COALESCE(tt.totalAmount, 0) + COALESCE(mt.totalAmount, 0) >= ?)`);
        params.push(minSpent);
    }

    if (maxSpent){
        conditions.push(`(COALESCE(tt.totalAmount, 0) + COALESCE(mt.totalAmount, 0)) <= ?`);
        params.push(maxSpent);
    }

    if(purchaseType === "tickets"){
        conditions.push(`tt.ticketType IS NOT NULL`);
    }else if(purchaseType === "merchandise"){
        conditions.push(`mt.merchandiseID IS NOT NULL`);
    }else if(purchaseType === "both"){
        conditions.push(`tt.ticketType IS NOT NULL AND mt.merchandiseID IS NOT NULL`);
    }

    if(merchandiseItem){
        conditions.push(`m.itemName LIKE ?`);
        params.push(`%${merchandiseItem}`);
    }

    if (conditions.length > 0){
        query += ` AND ` + conditions.join(" AND ");
    }

    pool.query(query, params, (error, results) => {
        if(error){
            console.error("Error filtering visitor purchases:", error);
            res.writeHead(500, {"Content-Type": "application/json"});
            res.end(JSON.stringify({error: "Internal server error"}));
            return;
        }
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(results));
    });
};

const attendanceAndRevenueReport = (req,res) => {
    const parsedUrl = require('url').parse(req.url, true);
    const {
        startDate, //only choose to make optional parameters for attributes that can be modified in the report, we do not need revenue in here because it is necessary in the report
        endDate,
        weatherCondition
    } = parsedUrl.query;

    let query = queries.attendanceAndRevenueReport;
    const params = [];
    const conditions = [];

    if(startDate){
        conditions.push(`oh.dateOH >= ?`);
        params.push(startDate);
    }

    if(endDate){
        conditions.push(`oh.dateOH <= ?`);
        params.push(endDate);
    }

    if(weatherCondition){
        conditions.push(`oh.weatherCondition = ?`);
        params.push(weatherCondition);
    }

    if(conditions.length > 0){
        query += " And " + conditions.join(" And ");
    }

    query += ` GROUP BY oh.dateOH, oh.weatherCondition ORDER BY oh.dateOH DESC`; //remember to add this to the end of the query so we can use the aggregate functions
    pool.query(query, params, (error, results) => {
        if (error) {
            console.error("Error fetching attendance and revenue report:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
};

const getVisitorAccountInfo = (req, res) => {
    const parsedUrl = url.parse(req.url, true); 
    const { visitorID } = parsedUrl.query; 

    if (!visitorID) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Missing 'VisitorID' query parameter" }));
        return;
    }

    pool.query(queries.getVisitorAccountInfo, [visitorID], (error, results) => {
        if (error) {
            console.error("Error visitor account information:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
};

const getEmployeeAccountInfo = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { employeeID } = parsedUrl.query; 

    if (!employeeID) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Missing 'employeeID' query parameter" }));
        return;
    }

    pool.query(queries.getEmployeeAccountInfo, [employeeID], (error, results) => {
        if (error) {
            console.error("Error fetching employee account info:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
            return;
        }
    
        console.log("Query Results:", results); // Debugging line
    
        if (results.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Employee not found" }));
        } else {
            console.log("Sending Employee Data:", results[0]); // Debugging line
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(results[0])); 
        }
    });    
};

const getSupervisorAccountInfo = (req,res) => {
    const parsedUrl = url.parse(req.url, true); 
    const { username, password } = parsedUrl.query; 

    if (!username || !password) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Missing 'username' or 'password' query parameter" }));
        return;
    }

    pool.query(queries.getSupervisorAccountInfo, [username, password], (error, results) => {
        if (error) {
            console.error("Error fetching supervisor account info:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
};


const checkRideExists = (req, res) => {
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

        const { RideName } = parsedBody;

        if (!RideName) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'RideName is required' }));
            return;
        }

        pool.query(queries.checkRideExists, [RideName], (err, results) => {
            if (err) {
                console.error('Error querying checkRideExists:', err);
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

const addRide = (req, res) => {
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
            RideID, RideName, MinHeight, MaxWeight, Capacity, Duration, MaintenanceStatus, MaintenanceNeed
        } = parsedBody;

        if (!RideID || !RideName || !MinHeight || !MaxWeight || !Capacity || !Duration || !MaintenanceStatus || !MaintenanceNeed) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "All ride fields are required." }));
            return;
        }

        pool.query(queries.checkRideExists, [RideName], (error, results) => {
            if (error) {
                console.error("Error checking existing ride:", error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal server error" }));
                return;
            }

            if (results.length > 0) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Ride already exists" }));
                return;
            }

            pool.query(
                queries.addRide,
                [RideID, RideName, MinHeight, MaxWeight, Capacity, Duration, MaintenanceStatus, MaintenanceNeed],
                (error, results) => {
                    if (error) {
                        console.error("Error adding ride:", error);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Internal server error" }));
                        return;
                    }

                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Ride added successfully", RideID: results.insertId }));
                }
            );
        });
    });
};

const sendLowStockNotifications = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    //const queryParams = new URLSearchParams(parsedUrl.query ? parsedUrl.query : '');
    const SupervisorID = parsedUrl.query.SupervisorID;

    console.log("Received Supervisor ID:", SupervisorID);

    if (!SupervisorID) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Supervisor ID is required" }));
        return;
    }

    pool.query(
        queries.sendLowStockNotifications,
        [SupervisorID],
        (err, results) => {
            if (err) {
                console.error("Error fetching notifications:", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Internal server error" }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        }
    );
};

const insertRideMaintenance = (req,res) => {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        let parsedBody;

        try {
            parsedBody = JSON.parse(body);
        } catch (error) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid JSON format" }));
            return;
        }

        const {rideID, status, reason, MaintenanceEndDate, MaintenanceEmployeeID, MaintenanceStartDate} = parsedBody;

        if (!rideID || !status || !reason || !MaintenanceEndDate || !MaintenanceEmployeeID || !MaintenanceStartDate) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "rideID, status, and reason are required." }));
            return;
        }

        pool.query(queries.insertRideMaintenance, [rideID,status,reason, MaintenanceEndDate, MaintenanceEmployeeID, MaintenanceStartDate], (error, results) => {
            if (error) {
                        console.error("Error adding ride maintenance:", error);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Internal server error" }));
                        return;
                    }

                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Ride maintenance added successfully", maintenanceID: results.insertId}));
        });
    });
};

const completedRideMaintenance = (req,res) => {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        let parsedBody;

        try{
            parsedBody = JSON.parse(body);
        } 
        catch (err){
            res.writeHead(400, {"Content-Type": "application/json"});
            return res.end(JSON.stringify({error: "Invalid JSON format"}));
        }

        const { rideID } = parsedBody;

        if (!rideID) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "rideID is required" }));
        }

        pool.query(queries.completedRideMaintenance, [rideID], (err, results) => {
            if (err) {
                console.error("Error updating maintenance:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "Internal server error" }));
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Ride maintenance marked as completed." }));
        });

        pool.query(queries.removeHomePageAlert, [rideID], (err2) => {
            if (err2) {
                console.error("Failed to resolve alert:", err2);
            }
        
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Ride maintenance marked as completed and alert resolved." }));
        });
    });
};

const updateEmployeeInfo = (req, res) => {
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
        return res.end(JSON.stringify({ error: "Invalid JSON format" }));
        }

        const { employeeID, FirstName, LastName, Email, address, username, password } = parsedBody;

        if (!employeeID) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "employeeID is required" }));
        }

        const fields = [];
        const values = [];
    
        if (FirstName) {
            fields.push("FirstName = ?");
            values.push(FirstName);
        }
        if (LastName) {
            fields.push("LastName = ?");
            values.push(LastName);
        }
        if (Email) {
            fields.push("Email = ?");
            values.push(Email);
        }
        if (address) {
            fields.push("Address = ?");
            values.push(address);
        }
        if (username) {
            fields.push("username = ?");
            values.push(username);
        }
        if (password) {
            fields.push("password = ?");
            values.push(password);
        }

        if (fields.length === 0) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "No fields provided to update" }));
        }
    
        const sql = `UPDATE employee SET ${fields.join(", ")} WHERE employeeID = ?`;
        values.push(employeeID);
    
        pool.query(sql, values, (err, result) => {
            if (err) {
            console.error("Error updating employee:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Internal server error" }));
            }
    
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Employee info updated successfully." }));
        });
    });
};

const reorderMerchandise = (req,res) => {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        let parsedBody;

        try {
            parsedBody = JSON.parse(body);
        } catch (error) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid JSON format" }));
            return;
        }

        const {merchandiseID, quantityOrdered, expectedArrivalDate, status, notes} = parsedBody;

        const statToInsert = status || 'pending';
        const notesToInsert = notes || 'No notes';

        if (!merchandiseID || !quantityOrdered || !expectedArrivalDate || !statToInsert || !notesToInsert) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "merchandiseID, quantityOrdered, expectedArrivalDate, status, and notes are required." }));
            return;
        }

        pool.query(queries.reorderMerchandise, [merchandiseID, quantityOrdered, expectedArrivalDate, statToInsert, notesToInsert], (error, results) => {
            if (error) {
                        console.error("Error adding merchandise re-order:", error);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Internal server error" }));
                        return;
                    }

                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Merchandise ordered successfully", reorderID: results.insertId}));
        });
    });
};

const getMerchList = (req,res) => {
    pool.query(queries.getMerchList, (err,results) => {
        if(err){
            console.error("Error fetching merchandise:", err);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Failed to fetch merchandise'}));
        }
        else{
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(results));
        }
    });
};

const markStockArrivals = (req,res) => {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        let parsedBody;

        try {
            parsedBody = JSON.parse(body);
        } catch (error) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid JSON format" }));
            return;
        }

        const {merchandiseID,quantityAdded,arrivalDate,notes,reorderID} = parsedBody;

        const notesToInsert = notes || 'No notes';

        if (!merchandiseID || !quantityAdded || !arrivalDate || !notesToInsert || !reorderID) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "merchandiseID, quantityOrdered, expectedArrivalDate, status, and notes are required." }));
            return;
        }

        pool.query(queries.markStockArrivals, [merchandiseID,quantityAdded,arrivalDate,notes,reorderID], (error, results) => {
            if (error) {
                console.error("Error adding stock arrival:", error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal server error" }));
                return;
            }

            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "New stock marked as arrived successfully", arrivalID: results.insertId}));
        });
    });
};

const getPendingOrders = (req, res) => {
    pool.query(queries.getPendingOrders, (error, results) => {
        if (error) {
            console.error("Error fetching re-orders:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
            return;
        }
    
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
};

const getMerchandiseTable = (req, res) => {
    pool.query(queries.getMerchandiseTable, (error, results) => {
        if (error){
            console.error("Error fetching available merchandise:", error);
            res.writeHead(500, {"Content-Type": "application/json"});
            res.end(JSON.stringify({error: "Internal server error"}));
            return;
        }
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(results));
    });
};

const getMerchandiseReordersTable = (req, res) => {
    pool.query(queries.getMerchandiseReordersTable, (error, results) => {
        if (error){
            console.error("Error fetching pending orders:", error);
            res.writeHead(500, {"Content-Type": "application/json"});
            res.end(JSON.stringify({error: "Internal server error"}));
            return;
        }
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(results));
    });
};

const addMerchandise = (req,res) => {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        let parsedBody;

        try {
            parsedBody = JSON.parse(body);
        } catch (error) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid JSON format" }));
            return;
        }

        const {itemName,price,quantity} = parsedBody;

        const giftShopName = 'Andromeda Galaxy Gift Shop';
        const departmentNumber = 5;

        if (!itemName || !price || !quantity || !giftShopName || !departmentNumber) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "itemName, price, and quantity are required." }));
            return;
        }

        pool.query(queries.addMerchandise, [itemName, price, quantity, giftShopName, departmentNumber], (error, results) => {
            if (error) {
                        console.error("Error adding merchandise:", error);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Internal server error" }));
                        return;
                    }

                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "New item added successfully", merchandiseID: results.insertId}));
        });
    });
};

const addMaintenanceRequest = (req,res) => {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        let parsedBody;

        try {
            parsedBody = JSON.parse(body);
        } catch (error) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid JSON format" }));
            return;
        }

        const {RideID,status,reason,MaintenanceEndDate,MaintenanceEmployeeID,MaintenanceStartDate} = parsedBody;

        if (!RideID || !status || !reason || !MaintenanceStartDate || !MaintenanceEndDate || !MaintenanceEmployeeID) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Ride ID number, status, reason, start date, expected end date, and employee ID number  are required." }));
            return;
        }

        pool.query(queries.addMaintenanceRequest, [RideID,status,reason,MaintenanceEndDate,MaintenanceEmployeeID,MaintenanceStartDate], (error, results) => {
            if (error) {
                console.error("Error making a maintenance request:", error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal server error" }));
                return;
            }

            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "New maintenance request made successfully", maintenanceID: results.insertId}));
        });
    });
};

const getRidesForMaintenanceRequest = (req,res) => {
    pool.query(queries.getRidesForMaintenanceRequest, (error,results) => {
        if (error){
            console.log("Error fetching ride information for maintenance request:", error);
            res.writeHead(500, {"Content-Type": "application/json"});
            res.end(JSON.stringify({error: "Internal server error"}));
            return;
        }
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(results));
    });
};

const getEmployeesForMaintenanceRequest = (req,res) => {
    pool.query(queries.getMaintenanceEmployeesForMR, (error, results) => {
        if (error){
            console.log("Error fetching maintenance employee info:", error);
            res.writeHead(500, {"Content-Type": "application/json"});
            res.end(JSON.stringify({error: "Internal server error"}));
            return;
        }
        res.writeHead(200, {"Content-Type":"application/json"});
        res.end(JSON.stringify(results));
    });
};

const completeMaintenanceRequest = (req, res) => {
    let body = "";

    req.on("data", chunk => {
        body += chunk.toString();
    });

    req.on("end", () => {
        let parsedBody;

        try {
            parsedBody = JSON.parse(body);
        } catch (err) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid JSON" }));
            return;
        }

        const { maintenanceID, MaintenanceEndDate } = parsedBody;

        if (!maintenanceID || !MaintenanceEndDate) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "maintenanceID and MaintenanceEndDate are required." }));
            return;
        }

        pool.query(queries.completeMaintenanceRequest, [MaintenanceEndDate, maintenanceID], (err, results) => {
            if (err) {
            console.error("Error completing maintenance request:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Database error" }));
            return;
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Maintenance marked as completed" }));
        });
    });
};

const getPendingMaintenance = (req,res) => {
    pool.query(queries.getPendingMaintenance, (error,results) => {
        if(error){
            console.error("Error fetching pending maintenance requests:", error);
            res.writeHead(500, {"Content-Type": "application/json"});
            res.end(JSON.stringify({error: "Internal server error"}));
            return;
        }
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(results));
    });
};

const getMaintenanceRequests = (req,res) => {
    pool.query(queries.getMaintenanceRequests, (error, results) => {
        if(error){
            console.error("Error fetching ride maintenance requests:", error);
            res.writeHead(500, {"Content-Type": "application/json"});
            res.end(JSON.stringify({error: "Internal server error"}));
            return;
        }
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(results));
    });
};

const getVisitorMerchPurchases = (req,res) => {
    const parsedUrl = url.parse(req.url, true);//use when: redirected from another page -> we need to pass info we received in the page we redirected from (the url contains the visitorID)
    const visitorID = parsedUrl.query.visitorID;

    if(!visitorID){
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Missing visitorID" }));
        return;
    }
    pool.query(queries.getVisitorMerchPurchases, [visitorID], (error, results) => {
        if(error){
            console.error("Error fetching purchase history:", error);
            res.writeHead(500, {"Content-Type": "application/json"});
            res.end(JSON.stringify({error: "Internal server error"}));
            return;
        }
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(results));
    });
};

const getVisitorTicketTransactions = (req,res) => {
    const parsedUrl = url.parse(req.url, true);//use when: redirected from another page -> we need to pass info we received in the page we redirected from (the url contains the visitorID)
    const visitorID = parsedUrl.query.visitorID;

    if(!visitorID){
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Missing visitorID" }));
        return;
    }
    pool.query(queries.getVisitorTicketTransactions, [visitorID], (error, results) => {
        if(error){
            console.error("Error fetching purchase history:", error);
            res.writeHead(500, {"Content-Type": "application/json"});
            res.end(JSON.stringify({error: "Internal server error"}));
            return;
        }
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(results));
    });
};

const getHomePageAlerts = (req,res) => {
    pool.query(queries.getHomePageAlerts, (error, results) => {
        if (error) {
            console.error("Error fetching homepage alerts:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
            return;
        }
    
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
};

const getSupervisorNames = (req,res) => {
    pool.query(queries.getSupervisorNames, (error, results) => {
        if(error) {
            console.error("Error fetching supervisor names:", error);
            res.writeHead(500, {"Content-Type": "application/json"});
            res.end(JSON.stringify({error: "Internal server error"}));
            return;
        }
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(results));
    });
};

const getDepartmentNames = (req,res) => {
    pool.query(queries.getDepartmentNames, (error, results) => {
        if(error) {
            console.error("Error fetching department names:", error);
            res.writeHead(500, {"Content-Type": "application/json"});
            res.end(JSON.stringify({error: "Internal server error"}));
            return;
        }
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(results));
    });
};

const addMealPlanTransaction = (req,res) => {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        let parsedBody;
        try{
            parsedBody = JSON.parse(body);
        }
        catch{
            res.writeHead(400, {"Content-Type":"application/json"});
            res.end(JSON.stringify({error: "Invalid JSON format"}));
            return;
        }

        const {VisitorID, mealPlanID} = parsedBody;
        if(!VisitorID || !mealPlanID){
            res.writeHead(400, {"Content-Type":"application/json"});
            res.end(JSON.stringify({error: "Visitor ID and meal plan ID are required."}));
            return;
        }
        
        // Use hardcoded prices instead of database lookup for demo purposes
        // (This is a temporary fix until the mealPlans table issue is resolved)
        let price = 49.99; // Default price for General Meal Plan
        if (mealPlanID === 2) {
            price = 89.99; // Price for Cosmic Meal Plan
        }
        
        console.log(`Adding meal plan transaction: Plan ID: ${mealPlanID}, Visitor ID: ${VisitorID}, Price: ${price}`);

        pool.query(queries.addMealPlanTransaction, [mealPlanID, VisitorID, new Date(), price], (error, results) => {
            if(error){
                console.log("Error making meal plan transaction:", error);
                res.writeHead(500, {"Content-Type":"application/json"});
                res.end(JSON.stringify({error: "Internal server error"}));
                return;
            }
            const transactionID = results.insertId;
            res.writeHead(200, {"Content-Type":"application/json"});
            res.end(JSON.stringify({message: "Meal plan purchased successfully", transactionID}));
        });
    })
};

const deleteMerchandise = (req, res) => {
    const merchandiseID = req.url.split('/').pop();
    
    if (!merchandiseID) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Missing merchandise ID" }));
        return;
    }
    
    pool.query('DELETE FROM merchandise WHERE merchandiseID = ?', [merchandiseID], (error, results) => {
        if (error) {
            console.error("Error deleting merchandise:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
            return;
        }
        
        if (results.affectedRows === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Merchandise not found" }));
            return;
        }
        
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Merchandise deleted successfully" }));
    });
};

const updateMerchandise = (req, res) => {
    let body = '';
    
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        let parsedBody;
        try {
            parsedBody = JSON.parse(body);
        } catch (err) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid JSON format" }));
            return;
        }
        
        const { merchandiseID, itemName, price, quantity, giftShopName, description } = parsedBody;
        
        if (!merchandiseID || !itemName || price === undefined || quantity === undefined) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Missing required fields" }));
            return;
        }
        
        pool.query(
            'UPDATE merchandise SET itemName = ?, price = ?, quantity = ?, giftShopName = ?, description = ? WHERE merchandiseID = ?',
            [itemName, price, quantity, giftShopName || null, description || null, merchandiseID],
            (error, results) => {
                if (error) {
                    console.error("Error updating merchandise:", error);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Internal server error" }));
                    return;
                }
                
                if (results.affectedRows === 0) {
                    res.writeHead(404, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Merchandise not found" }));
                    return;
                }
                
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Merchandise updated successfully" }));
            }
        );
    });
};

const getMerchandiseSalesData = (req, res) => {
    // This endpoint will return mock data for now
    // In a real application, you would query the merchandisetransactions table
    const mockSalesData = [
        { itemName: "Space Helmet", quantity: 25, totalAmount: 1249.75, transactionDate: new Date('2023-10-01') },
        { itemName: "Cosmic T-shirt", quantity: 40, totalAmount: 1199.60, transactionDate: new Date('2023-10-05') },
        { itemName: "Alien Plush", quantity: 30, totalAmount: 599.70, transactionDate: new Date('2023-10-10') },
        { itemName: "Rocket Keychain", quantity: 55, totalAmount: 274.45, transactionDate: new Date('2023-10-15') },
        { itemName: "Galaxy Mug", quantity: 28, totalAmount: 419.72, transactionDate: new Date('2023-10-20') },
        { itemName: "Astronaut Ice Cream", quantity: 60, totalAmount: 299.40, transactionDate: new Date('2023-10-25') },
        { itemName: "Constellation Map", quantity: 15, totalAmount: 374.85, transactionDate: new Date('2023-11-01') },
        { itemName: "Glow-in-the-dark Stars", quantity: 35, totalAmount: 174.65, transactionDate: new Date('2023-11-05') },
        { itemName: "Space Puzzle", quantity: 18, totalAmount: 449.82, transactionDate: new Date('2023-11-10') },
        { itemName: "UFO Frisbee", quantity: 42, totalAmount: 209.58, transactionDate: new Date('2023-11-15') },
        { itemName: "Planet Stickers", quantity: 65, totalAmount: 129.35, transactionDate: new Date('2023-11-20') },
        { itemName: "Solar System Model", quantity: 12, totalAmount: 599.88, transactionDate: new Date('2023-11-25') }
    ];
    
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(mockSalesData));
};

const getEvents = (req,res) => {
    pool.query(queries.getEvents, (error, results) => {
        if(error){
            console.log("Error fetching events:", error);
            res.writeHead(500, {"Content-Type":"application/json"});
            res.end(JSON.stringify({error: "Internal server error"}));
            return;
        }
        const eventID = results.insertId;
        res.writeHead(200, {"Content-Type":"application/json"});
        res.end(JSON.stringify({message: "Events fetched successfully", eventID}));
    });
}

const addEvent = (req,res) => {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        let parsedBody;

        try {
            parsedBody = JSON.parse(body);
        } catch (error) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid JSON format" }));
            return;
        }

        const {eventName, durationMin, description, event_date, type} = parsedBody;

        if (!eventName || !durationMin || !description || !event_date || !type) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Event name, duration, description, event date, and type  are required." }));
            return;
        }

        pool.query(queries.addEvent, [eventName, durationMin, description, event_date, type], (error, results) => {
            if (error) {
                console.error("Error adding an event:", error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal server error" }));
                return;
            }

            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "New event added successfully", eventID: results.insertId}));
        });
    });
}

const updateEvent = (req, res) => {
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

        const { eventID, eventName, durationMin, description, event_date, type } = parsedBody;

        if (!eventID) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "eventID is required" }));
            return;
        }

        const fields = [];
        const values = [];

        if (eventName !== undefined) {
            fields.push("eventName = ?");
            values.push(eventName);
        }
        if (durationMin !== undefined) {
            fields.push("durationMin = ?");
            values.push(durationMin);
        }
        if (description !== undefined) {
            fields.push("description = ?");
            values.push(description);
        }
        if (event_date !== undefined) {
            fields.push("event_date = ?");
            values.push(event_date);
        }
        if (type !== undefined) {
            fields.push("type = ?");
            values.push(type);
        }

        if (fields.length === 0) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "No fields provided to update" }));
            return;
        }

        const sql = `UPDATE parkevent SET ${fields.join(", ")} WHERE eventID = ?`;
        values.push(eventID);

        pool.query(sql, values, (error, result) => {
            if (error) {
                console.error("Error updating event:", error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal server error" }));
                return;
            }

            if (result.affectedRows === 0) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Event not found" }));
                return;
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Event updated successfully" }));
        });
    });
};

const deleteEvent = (req, res) => {
    const parsedUrl = require('url').parse(req.url, true);
    const { eventID } = parsedUrl.query;

    if (!eventID) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Missing 'eventID' query parameter" }));
        return;
    }

    pool.query('DELETE FROM parkevent WHERE eventID = ?', [eventID], (error, results) => {
        if (error) {
            console.error("Error deleting event:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
            return;
        }

        if (results.affectedRows === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Event not found" }));
            return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Event deleted successfully" }));
    });
};

const getEmployeeSchedule = (req, res) => {
    const employeeID = req.url.split("/").pop();
    pool.query(queries.getEmployeeSchedule, [employeeID], (err, results) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Failed to fetch schedule" }));
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
};

const requestTimeOff = (req, res) => {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
        const { EmployeeID, startDate, endDate, reason } = JSON.parse(body);
        if (!EmployeeID || !startDate || !endDate || !reason) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Missing fields" }));
        }
        pool.query(queries.requestTimeOff, [EmployeeID, startDate, endDate, reason], (err, results) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "Failed to request time off" }));
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Request submitted", requestID: results.insertId }));
        });
    });
};

const clockIn = (req, res) => {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
        const { EmployeeID } = JSON.parse(body);
        const date = new Date().toISOString().split("T")[0];
        pool.query(queries.clockIn, [EmployeeID, date], (err) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "Clock-in failed" }));
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Clocked in" }));
        });
    });
};

const clockOut = (req, res) => {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
        const { EmployeeID } = JSON.parse(body);
        const date = new Date().toISOString().split("T")[0];
        pool.query(queries.clockOut, [EmployeeID, date], (err) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "Clock-out failed" }));
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Clocked out" }));
        });
    });
};

const getEmployeeProfile = (req, res) => {
    const parsedUrl = require("url").parse(req.url, true);
    const employeeID = parsedUrl.query.EmployeeID;
    pool.query(queries.getEmployeeProfile, [employeeID], (err, results) => {
        if (err || results.length === 0) {
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Failed to fetch profile" }));
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results[0]));
    });
};

const getFilteredEmployees = (req, res) => {
    const parsedUrl = require("url").parse(req.url, true);
    const { name, department, status } = parsedUrl.query;
  
    const conditions = [];
    const values = [];
  
    if (name) {
        conditions.push("(e.FirstName LIKE CONCAT('%', ?, '%') OR e.LastName LIKE CONCAT('%', ?, '%'))");
        values.push(name, name);
    }
  
    if (department) {
        conditions.push("e.Department = ?");
        values.push(department);
    }
  
    if (status) {
        conditions.push("e.employmentStatus = ?");
        values.push(status);
    }
  
    const sql = queries.getFilteredEmployees(conditions);
  
    pool.query(sql, values, (err, results) => {
        if (err) {
            console.error("Error fetching employees:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Internal server error" }));
        }
    
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
};

const addEmployeeSchedule = (req, res) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
        const { EmployeeID, Department, scheduleDate, shiftStart, shiftEnd, isRecurring } = JSON.parse(body);

        if (!EmployeeID || !Department || !scheduleDate || !shiftStart || !shiftEnd || isRecurring === undefined) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Missing required fields" }));
        }

        pool.query(queries.addEmployeeSchedule, [EmployeeID, Department, scheduleDate, shiftStart, shiftEnd, isRecurring], (err) => {
            if (err) {
                console.error("Error adding schedule:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "Internal error" }));
            }
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Schedule added" }));
        });
    });
};  

const deleteEmployeeSchedule = (req, res) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
        const { EmployeeID, scheduleDate } = JSON.parse(body);
    
        if (!EmployeeID || !scheduleDate) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "EmployeeID and scheduleDate are required" }));
        }
    
        pool.query(queries.deleteEmployeeSchedule, [EmployeeID, scheduleDate], (err, results) => {
            if (err) {
            console.error("Error deleting schedule:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Internal server error" }));
            }
    
            if (results.affectedRows === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "No matching schedule found" }));
            }
    
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Schedule deleted successfully" }));
        });
    });
}; 

const getTimeOffRequests = (req, res) => {
    pool.query(queries.getTimeOffRequests, (err, results) => {
        if (err) {
            console.error("Error fetching time off requests:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Internal server error" }));
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
};

const updateTimeOffRequestStatus = (req, res) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
        const { requestID, status } = JSON.parse(body);
    
        if (!requestID || !status || !['approved', 'denied'].includes(status)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Invalid requestID or status" }));
        }
    
        pool.query(queries.updateTimeOffRequestStatus, [status, requestID], (err, result) => {
            if (err) {
            console.error("Error updating time off status:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Internal server error" }));
            }
    
            if (result.affectedRows === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Request not found" }));
            }
    
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: `Request ${status} successfully` }));
        });
    });
};

const updateEmployeeProfile = (req, res) => {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
        const {
            EmployeeID,
            FirstName,
            LastName,
            Email,
            Address,
            username,
            password,
            Department,
            employmentStatus,
            SupervisorID
        } = JSON.parse(body);
    
        if (!EmployeeID) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "EmployeeID is required" }));
        }
    
        const fields = [];
        const values = [];
    
        if (FirstName !== undefined) {
            fields.push("FirstName = ?");
            values.push(FirstName);
        }
        if (LastName !== undefined) {
            fields.push("LastName = ?");
            values.push(LastName);
        }
        if (Email !== undefined) {
            fields.push("Email = ?");
            values.push(Email);
        }
        if (Address !== undefined) {
            fields.push("Address = ?");
            values.push(Address);
        }
        if (username !== undefined) {
            fields.push("username = ?");
            values.push(username);
        }
        if (password !== undefined) {
            fields.push("password = ?");
            values.push(password);
        }
        if (Department !== undefined) {
            fields.push("Department = ?");
            values.push(Department);
        }
        if (employmentStatus !== undefined) {
            fields.push("employmentStatus = ?");
            values.push(employmentStatus);
        }
        if (SupervisorID !== undefined) {
            fields.push("SupervisorID = ?");
            values.push(SupervisorID);
        }
    
        if (fields.length === 0) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "No fields provided to update" }));
        }
    
        const sql = queries.updateEmployeeProfile(fields);
        values.push(EmployeeID);
    
        pool.query(sql, values, (err, result) => {
            if (err) {
            console.error("Error updating employee profile:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Internal server error" }));
            }
    
            if (result.affectedRows === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Employee not found" }));
            }
    
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Employee profile updated successfully" }));
        });
    });
};

const deleteEmployee = (req, res) => {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
        const { EmployeeID } = JSON.parse(body);
    
        if (!EmployeeID) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "EmployeeID is required" }));
        }

        pool.query(queries.archiveEmployeeData, [EmployeeID], (archiveErr) => {
            if (archiveErr) {
            console.error("Error archiving employee data:", archiveErr);
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Failed to archive employee data" }));
            }

            pool.query(queries.deleteEmployee, [EmployeeID], (err, result) => {
            if (err) {
                console.error("Error deleting employee:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "Internal server error" }));
            }
    
            if (result.affectedRows === 0) {
                res.writeHead(404, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "Employee not found" }));
            }
    
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Employee deleted successfully" }));
            });
        });
    });
};

const getFilteredSalesReport = (req, res) => {
    const { startDate, endDate, transactionType = "all", bestOnly = "0" } = url.parse(req.url, true).query;

    if (!startDate || !endDate) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "startDate and endDate are required" }));
    }

    const validTypes = ["ticket", "mealplan", "merch"];
    let includeTypes = transactionType === "all" ? validTypes : [transactionType];

    const unionParts = [];
    if (includeTypes.includes("ticket")) unionParts.push("SELECT transactionDate FROM tickettransactions");
    if (includeTypes.includes("mealplan")) unionParts.push("SELECT transactionDate FROM mealplantransactions");
    if (includeTypes.includes("merch")) unionParts.push("SELECT transactionDate FROM merchandisetransactions");

    const dateSource = `(${unionParts.join(" UNION ALL ")})`;

    const fields = [`d.transactionDate`];

    if (bestOnly === "0") {
        if (includeTypes.includes("ticket")) {
            fields.push(`
            (
                SELECT COUNT(*) FROM tickettransactions t2
                WHERE DATE(t2.transactionDate) = d.transactionDate
            )`);
        }
        if (includeTypes.includes("mealplan")) {
            fields.push(`
            (
                SELECT COUNT(*) FROM mealplantransactions m2
                WHERE DATE(m2.transactionDate) = d.transactionDate
            )`);
        }
        if (includeTypes.includes("merch")) {
            fields.push(`
            (
                SELECT COUNT(*) FROM merchandisetransactions mt2
                WHERE DATE(mt2.transactionDate) = d.transactionDate
            )`);
        }
    
        fields.push(`
            (
            IFNULL((
                SELECT SUM(tix.price)
                FROM tickettransactions t2
                JOIN tickets tix ON t2.transactionID = tix.transactionID
                WHERE DATE(t2.transactionDate) = d.transactionDate
            ), 0) +
            IFNULL((
                SELECT SUM(mp.price)
                FROM mealplantransactions m2
                JOIN mealplans mp ON m2.mealPlanID = mp.mealPlanID
                WHERE DATE(m2.transactionDate) = d.transactionDate
            ), 0) +
            IFNULL((
                SELECT SUM(mt2.totalAmount)
                FROM merchandisetransactions mt2
                WHERE DATE(mt2.transactionDate) = d.transactionDate
            ), 0)
            ) AS totalRevenue
        `);
    
        fields.push(`
            (
            (
                IFNULL((SELECT SUM(tix.price) FROM tickettransactions t2 JOIN tickets tix ON t2.transactionID = tix.transactionID WHERE DATE(t2.transactionDate) = d.transactionDate), 0) +
                IFNULL((SELECT SUM(mp.price) FROM mealplantransactions m2 JOIN mealplans mp ON m2.mealPlanID = mp.mealPlanID WHERE DATE(m2.transactionDate) = d.transactionDate), 0) +
                IFNULL((SELECT SUM(mt2.totalAmount) FROM merchandisetransactions mt2 WHERE DATE(mt2.transactionDate) = d.transactionDate), 0)
            )
            /
            (
                (SELECT COUNT(*) FROM tickettransactions WHERE DATE(transactionDate) = d.transactionDate) +
                (SELECT COUNT(*) FROM mealplantransactions WHERE DATE(transactionDate) = d.transactionDate) +
                (SELECT COUNT(*) FROM merchandisetransactions WHERE DATE(transactionDate) = d.transactionDate)
            )
            ) AS avgRevenuePerItem
        `);
        }
    
        if (includeTypes.includes("ticket")) {
        fields.push(`
            IFNULL((
            SELECT t2.ticketType
            FROM tickettransactions t2
            WHERE DATE(t2.transactionDate) = d.transactionDate
            GROUP BY t2.ticketType
            ORDER BY COUNT(*) DESC
            LIMIT 1
            ), 'N/A') AS bestSellingTicket
        `);
    
        if (bestOnly === "0") {
            fields.push(`
            IFNULL((
                SELECT t2.ticketType
                FROM tickettransactions t2
                WHERE DATE(t2.transactionDate) = d.transactionDate
                GROUP BY t2.ticketType
                ORDER BY COUNT(*) ASC
                LIMIT 1
            ), 'N/A') AS worstSellingTicket
            `);
        }
        }
    
        if (includeTypes.includes("mealplan")) {
        fields.push(`
            IFNULL((
            SELECT mp.mealPlanName
            FROM mealplantransactions m2
            JOIN mealplans mp ON m2.mealPlanID = mp.mealPlanID
            WHERE DATE(m2.transactionDate) = d.transactionDate
            GROUP BY mp.mealPlanName
            ORDER BY COUNT(*) DESC
            LIMIT 1
            ), 'N/A') AS bestSellingMealPlan
        `);
    
        if (bestOnly === "0") {
            fields.push(`
            IFNULL((
                SELECT mp.mealPlanName
                FROM mealplantransactions m2
                JOIN mealplans mp ON m2.mealPlanID = mp.mealPlanID
                WHERE DATE(m2.transactionDate) = d.transactionDate
                GROUP BY mp.mealPlanName
                ORDER BY COUNT(*) ASC
                LIMIT 1
            ), 'N/A') AS worstSellingMealPlan
            `);
        }
        }
    
        if (includeTypes.includes("merch")) {
        fields.push(`
            IFNULL((
            SELECT m.itemName
            FROM merchandisetransactions mt2
            JOIN merchandise m ON mt2.merchandiseID = m.merchandiseID
            WHERE DATE(mt2.transactionDate) = d.transactionDate
            GROUP BY m.itemName
            ORDER BY COUNT(*) DESC
            LIMIT 1
            ), 'N/A') AS bestSellingMerch
        `);
    
        if (bestOnly === "0") {
            fields.push(`
            IFNULL((
                SELECT m.itemName
                FROM merchandisetransactions mt2
                JOIN merchandise m ON mt2.merchandiseID = m.merchandiseID
                WHERE DATE(mt2.transactionDate) = d.transactionDate
                GROUP BY m.itemName
                ORDER BY COUNT(*) ASC
                LIMIT 1
            ), 'N/A') AS worstSellingMerch
            `);
        }
        }
    
        const sql = `
        SELECT ${fields.join(',')}
        FROM (
            SELECT DISTINCT DATE(transactionDate) AS transactionDate
            FROM ${dateSource} combined
            WHERE DATE(transactionDate) BETWEEN ? AND ?
        ) d
        ORDER BY d.transactionDate
        `;
    
        pool.query(sql, [startDate, endDate], (err, results) => {
        if (err) {
            console.error("Error generating sales report:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Internal server error" }));
        }
    
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
};

const getTransactionSummaryReport = (req, res) => {
    const { startDate, endDate } = url.parse(req.url, true).query;
  
    if (!startDate || !endDate) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Missing date range" }));
    }
  
    pool.query(
      queries.getTransactionSummaryReport,
      [startDate, endDate, startDate, endDate, startDate, endDate],
      (err, results) => {
        if (err) {
          console.error("Transaction summary error:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Internal server error" }));
        }
  
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
      }
    );
  };  

  const getBestWorstSellersReport = (req, res) => {
    const { startDate, endDate, groupBy = 'month', transactionType = 'all' } = url.parse(req.url, true).query;
  
    if (!startDate || !endDate) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Missing date range" }));
    }
  
    const groupExpr = groupBy === 'week'
      ? "YEARWEEK(transactionDate)"
      : "DATE_FORMAT(transactionDate, '%Y-%m')";
  
    const queries = [];
  
    if (transactionType === 'all' || transactionType === 'ticket') {
      queries.push(`
        SELECT period, 'ticket' AS type,
          (
            SELECT ticketType
            FROM tickettransactions t2
            WHERE DATE(t2.transactionDate) BETWEEN '${startDate}' AND '${endDate}'
            AND ${groupExpr.replace(/transactionDate/g, 't2.transactionDate')} = period
            GROUP BY ticketType
            ORDER BY COUNT(*) DESC
            LIMIT 1
          ) AS best,
          (
            SELECT ticketType
            FROM tickettransactions t3
            WHERE DATE(t3.transactionDate) BETWEEN '${startDate}' AND '${endDate}'
            AND ${groupExpr.replace(/transactionDate/g, 't3.transactionDate')} = period
            GROUP BY ticketType
            ORDER BY COUNT(*) ASC
            LIMIT 1
          ) AS worst
        FROM (
          SELECT ${groupExpr} AS period
          FROM tickettransactions
          WHERE DATE(transactionDate) BETWEEN '${startDate}' AND '${endDate}'
          GROUP BY ${groupExpr}
        ) t
      `);
    }
  
    if (transactionType === 'all' || transactionType === 'mealplan') {
      queries.push(`
        SELECT period, 'mealplan' AS type,
          (
            SELECT mp.mealPlanName
            FROM mealplantransactions m2
            JOIN mealplans mp ON m2.mealPlanID = mp.mealPlanID
            WHERE DATE(m2.transactionDate) BETWEEN '${startDate}' AND '${endDate}'
            AND ${groupExpr.replace(/transactionDate/g, 'm2.transactionDate')} = period
            GROUP BY mp.mealPlanName
            ORDER BY COUNT(*) DESC
            LIMIT 1
          ) AS best,
          (
            SELECT mp.mealPlanName
            FROM mealplantransactions m3
            JOIN mealplans mp ON m3.mealPlanID = mp.mealPlanID
            WHERE DATE(m3.transactionDate) BETWEEN '${startDate}' AND '${endDate}'
            AND ${groupExpr.replace(/transactionDate/g, 'm3.transactionDate')} = period
            GROUP BY mp.mealPlanName
            ORDER BY COUNT(*) ASC
            LIMIT 1
          ) AS worst
        FROM (
          SELECT ${groupExpr} AS period
          FROM mealplantransactions
          WHERE DATE(transactionDate) BETWEEN '${startDate}' AND '${endDate}'
          GROUP BY ${groupExpr}
        ) m
      `);
    }
  
    if (transactionType === 'all' || transactionType === 'merch') {
      queries.push(`
        SELECT period, 'merch' AS type,
          (
            SELECT m.itemName
            FROM merchandisetransactions mt2
            JOIN merchandise m ON mt2.merchandiseID = m.merchandiseID
            WHERE DATE(mt2.transactionDate) BETWEEN '${startDate}' AND '${endDate}'
            AND ${groupExpr.replace(/transactionDate/g, 'mt2.transactionDate')} = period
            GROUP BY m.itemName
            ORDER BY COUNT(*) DESC
            LIMIT 1
          ) AS best,
          (
            SELECT m.itemName
            FROM merchandisetransactions mt3
            JOIN merchandise m ON mt3.merchandiseID = m.merchandiseID
            WHERE DATE(mt3.transactionDate) BETWEEN '${startDate}' AND '${endDate}'
            AND ${groupExpr.replace(/transactionDate/g, 'mt3.transactionDate')} = period
            GROUP BY m.itemName
            ORDER BY COUNT(*) ASC
            LIMIT 1
          ) AS worst
        FROM (
          SELECT ${groupExpr} AS period
          FROM merchandisetransactions
          WHERE DATE(transactionDate) BETWEEN '${startDate}' AND '${endDate}'
          GROUP BY ${groupExpr}
        ) mt
      `);
    }
  
    const sql = queries.join('\nUNION ALL\n');
  
    pool.query(sql, (err, results) => {
      if (err) {
        console.error("Bestsellers report error:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Internal server error" }));
      }
  
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    });
  };  

const getEmployeeNames = (req,res) => {
    pool.query(queries.getEmployeeNames, (err, results) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Failed to fetch names" }));
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
};

const getEmployeeScheduleForSup = (req,res) => {
    pool.query(queries.getEmployeeScheduleForSup, (err, results) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Failed to fetch schedule" }));
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
};

const getSpecificEmployeeSchedule = (req, res) => {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const EmployeeID = urlObj.searchParams.get("EmployeeID");

    if (!EmployeeID) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "EmployeeID is required" }));
    }

    pool.query(queries.getSpecificEmployeeSchedule, [EmployeeID], (err, results) => {
        if (err) {
            console.error(err);
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Failed to fetch schedule" }));
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
};

const getSchedulesWithNames = (req, res) => {
    pool.query(queries.getSchedulesWithNames, (err, results) => {
        if (err) {
            console.error("Error fetching schedules:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Failed to fetch schedules" }));
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
};


//Check to see if you need to make a module.exports function here as well
module.exports = {
    getRides,
    getEmployees,
    addEmployee,
    getRidesNeedingMaintenance,
    getMerchandiseTransactions,
    loginVisitor,
    addVisitor,
    checkVisitorExists,
    getEmployeesByDept,
    updateMaintenanceStatus,
    getLowStockMerchandise,
    getSalesReport,
    getTicketSales,
    getVisitorRecords,
    addMerchandiseTransaction,
    rideMaintenanceReport,
    visitorPurchasesReport,
    attendanceAndRevenueReport,
    getVisitorAccountInfo,
    getEmployeeAccountInfo,
    getSupervisorAccountInfo,
    loginEmployee,
    loginSupervisor,
    addRide,
    checkRideExists,
    purchaseCosmicPass,
    purchaseGeneralPass,
    sendLowStockNotifications,
    insertRideMaintenance,
    completedRideMaintenance,
    updateEmployeeInfo,
    reorderMerchandise,
    getMerchList,
    markStockArrivals,
    getPendingOrders,
    getMerchandiseTable,
    getMerchandiseReordersTable,
    addMerchandise,
    addMaintenanceRequest,
    getRidesForMaintenanceRequest,
    getEmployeesForMaintenanceRequest,
    completeMaintenanceRequest,
    getPendingMaintenance,
    getMaintenanceRequests,
    getVisitorMerchPurchases,
    getVisitorTicketTransactions,
    getHomePageAlerts,
    getSupervisorNames,
    getDepartmentNames,
    addMealPlanTransaction,
    deleteMerchandise,
    updateMerchandise,
    getMerchandiseSalesData,
    getEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getEmployeeSchedule,
    requestTimeOff,
    clockIn,
    clockOut,
    getEmployeeProfile,
    getFilteredEmployees,
    addEmployeeSchedule,
    deleteEmployeeSchedule,
    getTimeOffRequests,
    updateTimeOffRequestStatus,
    updateEmployeeProfile,
    deleteEmployee,
    getFilteredSalesReport,
    getEmployeeNames,
    getEmployeeScheduleForSup,
    getSpecificEmployeeSchedule,
    getSchedulesWithNames,
    getTransactionSummaryReport,
    getBestWorstSellersReport
};  