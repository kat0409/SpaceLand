const actions = require('./actions');
const { rideMaintenanceReport } = require('./queries');

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

    if(url.startsWith('/'))

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

    if (url.startsWith('/supervisor/update-maintenance-status') && method === 'POST') {
        return actions.updateMaintenanceStatus(req, res);
    }

    if (url.startsWith('/supervisor/low-stock') && method === 'GET') {
        return actions.getLowStockMerchandise(req, res);
    }

    if (url.startsWith('/supervisor/sales-report') && method === 'GET') {
        return actions.getSalesReport(req, res);
    }

    if (url.startsWith('/supervisor/ticket-sales') && method === 'GET') {
        return actions.getTicketSales(req, res);
    }

    if (url.startsWith('/supervisor/visitors') && method === 'GET') {
        return actions.getVisitorRecords(req, res);
    }

    if(url.startsWith('/supervisor/low-stock') && method === 'GET'){
        return actions.lowStockMerchandiseReport(req,res);
    }

    if(url.startsWith('/supervisor/ride-maintenance') && method === 'GET'){
        return actions.rideMaintenanceReport(req,res);
    }

    if(url.startsWith('/add-merchandise-transaction') && method === 'POST'){
        return actions.addMerchandiseTransaction(req,res);
    }

    if(url.startsWith('/supervisor/visitor-purchases') && method === 'GET'){
        return actions.visitorPurchasesReport(req,res);
    }

    if(url.startsWith('/supervisor/attendance-revenue') && method === 'GET'){
        return actions.attendanceAndRevenueReport(req,res);
    }

    if(url.startsWith('/employee/account-info') && method === 'GET'){
        return actions.getEmployeeAccountInfo(req,res);
    }

    if(url.startsWith('/account-info') && method === 'GET'){
        return actions.getVisitorAccountInfo(req,res);
    }

    if(url.startsWith('/supervisor/account-info') && method === 'GET'){
        return actions.getSupervisorAccountInfo(req,res);
    }

    if(url.startsWith('/supervisor/add-ride') && method === 'POST'){
        return actions.addRide(req,res);
    }

    if(url.startsWith('/supervisor/login') && method === 'POST'){
        return actions.loginSupervisor(req,res);
    }

    if(url.startsWith('/employee/login') && method === 'POST'){
        return actions.loginEmployee(req,res);
    }

    if(url.startsWith('/supervisor/update-meal-plan') && method === 'PUT'){
        return actions.updateMealPlan(req,res);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not handled by router' }));
}

module.exports = routes;