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

    if (url.startsWith('/login') && method === 'POST') {
        return actions.loginVisitor(req, res);
    }

    /*if (url.startsWith('/add-employee') && method === 'GET') {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "This route requires POST method." }));
        return;
    }*/

    if ( url.startsWith('/add-visitor') && method === 'POST') {
        return actions.addVisitor(req, res);
    }

    if (url.startsWith('/check-visitor') && method === 'POST') {
        return actions.checkVisitorExists(req, res);
    }

    if(url.startsWith('/purchase-pass') && method === 'POST'){
        return actions.purchasePass(req,res);
    }

    if (url.startsWith('/supervisor/employees') && method === 'GET') {
        return actions.getEmployeesByDept(req, res);
    }

    if (url.startsWith('/supervisor/maintenance-requests') && method === 'GET') {
        return actions.getMaintenanceRequests(req, res);
    }
    

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not handled by router' }));
}

module.exports = routes;