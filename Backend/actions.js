const { stringify } = require('qs');
const pool = require('./db.js');
const queries = require('./queries.js');
const nodemailer = require('nodemailer');

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

        // Insert into `tickettransactions`
        pool.query(queries.createTransaction, [VisitorID, quantity, totalAmount, ticketType], (err, transactionResult) => {
            if (err) {
                console.error('Error creating transaction:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error' }));
                return;
            }

            const transactionID = transactionResult.insertId;

            // Insert tickets
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

        // Insert into `tickettransactions`
        pool.query(queries.createTransaction, [VisitorID, quantity, totalAmount, ticketType], (err, transactionResult) => {
            if (err) {
                console.error('Error creating transaction:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error' }));
                return;
            }

            const transactionID = transactionResult.insertId;

            // Insert tickets
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
const rideMaintenanceReport = (req,res) => {
    pool.query(queries.rideMaintenanceReport, (error, results) => {
        if (error) {
            console.error("Error fetching ride maintenance report:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
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
    const { Username, Password } = parsedUrl.query; 

    if (!Username || !Password) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Missing 'username' and 'password' query parameter" }));
        return;
    }

    pool.query(queries.getVisitorAccountInfo, [Username, Password], (error, results) => {
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
            console.error("Error fetching reorders:", error);
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
            console.error("Error fetching maintenance employees:", error);
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
            console.error("Error fetching maintenance employees:", error);
            res.writeHead(500, {"Content-Type": "application/json"});
            res.end(JSON.stringify({error: "Internal server error"}));
            return;
        }
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(results));
    });
};


//Check to see if you need to make a module.exports function here as well
module.exports = {
    getRides,
    getEmployees,
    addEmployee,
    getRidesNeedingMaintenance,
    addMaintenance,
    getMerchandiseTransactions,
    loginVisitor,
    addVisitor,
    checkVisitorExists,
    getEmployeesByDept,
    getMaintenanceRequests,
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
    getMerchandiseReordersTable
};