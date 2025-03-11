const http = require('http');
const {getRides, getEmployees, addEmployee, getRidesNeedingMaintenance, addMaintenance } = require('./functions.js');

//If you are calling a getter function, use GET
//If you are calling an add function, use POST

const server = http.createServer((request, response) => {
    const parsedURL = new URL(request.url, `http://${request.headers.host}`);

    // Route handling
    if (parsedUrl.pathname === '/rides' && req.method === 'GET') {
        getRides(req, res);
    } else if (parsedUrl.pathname === '/employees' && req.method === 'GET') {
        getEmployees(req, res);
    } else if (parsedUrl.pathname === '/add-employee' && req.method === 'POST') {
        addEmployee(req, res);
    } else if (parsedUrl.pathname === '/rides-needing-maintenance' && req.method === 'GET') {
        getRidesNeedingMaintenance(req, res);
    } else if (parsedUrl.pathname === '/add-maintenance' && req.method === 'POST') {
        addMaintenance(req, res);
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Route not found" }));
    }
});

const PORT  = process.env.PORT || 3000 //check if there is an environment variable

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});