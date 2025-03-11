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

const sendNotification = async

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

        const { FirstName, LastName, Email, Address, username, password, Department, employmentStatus, dateOfBirth } = parsedBody;

        // Validate required fields
        if (!FirstName || !LastName || !Email || !Address || !username || !password || !Department || !employmentStatus || !dateOfBirth) {
            response.writeHead(400, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ error: "All fields are required" }));
            return;
        }

        // Retrieve SupervisorID based on the department to check if the supervisorID exists in the supervisor table
        pool.query(queries.getSupervisorIDbyDept, [Department], (error, results) => {
            if (error) {
                console.error("Error retrieving supervisor ID:", error);
                response.writeHead(500, { "Content-Type": "application/json" });
                response.end(JSON.stringify({ error: "Internal server error" }));
                return;
            }
            if (results.length === 0) {
                response.writeHead(400, { "Content-Type": "application/json" });
                response.end(JSON.stringify({ error: "Supervisor was not found in the department." }));
                return;
            }

            // Use the retrieved SupervisorID
            const supervisorID = results[0].SupervisorID;

            // Add the employee to the database
            pool.query(
                queries.addEmployee,
                [FirstName, LastName, Email, Address, supervisorID, username, password, Department, employmentStatus, dateOfBirth],
                (error, results) => {
                    if (error) {
                        console.error("Error adding employee:", error);
                        response.writeHead(500, { "Content-Type": "application/json" });
                        response.end(JSON.stringify({ error: "Internal Server Error" }));
                        return;
                    }
                    response.writeHead(201, { "Content-Type": "application/json" });
                    response.end(JSON.stringify({ message: "Employee added successfully" }));
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
}

module.exports = {
    getRides,
    getEmployees,
    getRidesNeedingMaintenance,
    addEmployee,
    addMaintenance,
    getMerchandiseTransactions
};