const { stringify } = require('qs');
const pool = require('./db.js');
const queries = require('./queries.js');

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

//
