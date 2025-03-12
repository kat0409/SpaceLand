/*const actions = require('./actions'); 
const {URL} = require('url');

function routes(req, res) {
    const url =  req.url;
    const method = res.method;

    if(url === '/rides' && method === 'GET'){
        actions.getRides(req,res);
    }
    else if(url === '/employees' && method === 'GET'){
        actions.getEmployees(req,res);
    }
};

module.exports = routes;*/

// routes.js
const actions = require('./actions');

function routes(req, res) {
    const url = req.url;
    const method = req.method;

    if (url.startsWith('/rides') && method === 'GET') {
        return actions.getRides(req, res);
    }

    if (url.startsWith('/employees') && method === 'GET') {
        return actions.getEmployees(req, res);
    }

    if (url.startsWith('/add-employee') && method === 'POST') {
        return actions.addEmployee(req, res);
    }

    if (url.startsWith('/rides-needing-maintenance') && method === 'GET') {
        return actions.getRidesNeedingMaintenance(req, res);
    }

    if (url.startsWith('/add-maintenance') && method === 'POST') {
        return actions.addMaintenance(req, res);
    }

    if (url.startsWith('/merchandise-transactions') && method === 'GET') {
        return actions.getMerchandiseTransactions(req, res);
    }

    if (url.startsWith('/employee-login') && method === 'POST') {
        return actions.employeeLogin(req, res);
    }

    // Add more routes as needed...

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not handled by router' }));
}

module.exports = routes;