const actions = require('./actions');
const { rideMaintenanceReport } = require('./queries');

function routes(req, res) {
    const url = req.url;
    const method = req.method;

    if (url.startsWith('/rides') && method === 'GET') {
        return actions.getRides(req, res);
    }

    if (url.startsWith('/supervisor/HR/employees') && method === 'GET') {
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

    if(url.startsWith('/purchase-cosmic-pass') && method === 'POST'){
        return actions.purchaseCosmicPass(req,res);
    }

    if(url.startsWith('/purchase-general-pass') && method === 'POST'){
        return actions.purchaseGeneralPass(req,res);
    }

    if (url.startsWith('/supervisor/employees') && method === 'GET') {
        return actions.getEmployeesByDept(req, res);
    }

    if (url.startsWith('/supervisor/maintenance-requests') && method === 'GET') {
        return actions.getMaintenanceRequests(req, res);
    }//wont work anymore

    /*if (url.startsWith('/supervisor/update-maintenance-status') && method === 'POST') {
        return actions.updateMaintenanceStatus(req, res);
    }*/

    if (url.startsWith('/supervisor/merchandise/low-stock') && method === 'GET') {
        return actions.getLowStockMerchandise(req, res);
    }

    if (url.startsWith('/supervisor/sales-report') && method === 'GET') {
        return actions.getSalesReport(req, res);
    }

    if (url.startsWith('/supervisor/merchandise/ticket-sales') && method === 'GET') {
        return actions.getTicketSales(req, res);
    }

    if (url.startsWith('/supervisor/HR/visitors') && method === 'GET') {
        return actions.getVisitorRecords(req, res);
    }

    if(url.startsWith('/supervisor/maintenance/ride-maintenance') && method === 'GET'){
        return actions.rideMaintenanceReport(req,res);
    }

    if(url.startsWith('/add-merchandise-transaction') && method === 'POST'){
        return actions.addMerchandiseTransaction(req,res);
    }

    if(url.startsWith('/supervisor/merchandise/visitor-purchases') && method === 'GET'){
        return actions.visitorPurchasesReport(req,res);
    }

    if(url.startsWith('/supervisor/HR/attendance-revenue') && method === 'GET'){
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

    if(url.startsWith('/employee-login') && method === 'POST'){
        return actions.loginEmployee(req,res);
    }

    if(url.startsWith('/supervisor/update-meal-plan') && method === 'PUT'){
        return actions.updateMealPlan(req,res);
    }

    if(url.startsWith('/supervisor/merchandise/notifications') && method == 'GET'){
        return actions.sendLowStockNotifications(req,res);
    }//change route

    if(url.startsWith('/supervisor/maintenance/insert-ride-maintenance') && method == 'POST'){
        return actions.insertRideMaintenance(req,res);
    }

    if(url.startsWith('/supervisor/maintenance/update-ride-maintenance-status') && method == 'POST'){
        return actions.completedRideMaintenance(req,res);
    }

    if(url.startsWith('/update-employee') && method === 'PUT'){
        return actions.updateEmployeeInfo(req,res);
    }

    if(url.startsWith('/supervisor/merchandise/reorders') && method === 'POST'){
        return actions.reorderMerchandise(req,res);
    }

    if(url.startsWith('/supervisor/merchandise/items') && method === 'GET'){
        return actions.getMerchList(req,res);
    }
    
    if(url.startsWith('/supervisor/merchandise/stock-arrivals') && method === 'POST'){
        return actions.markStockArrivals(req,res);
    }

    if(url.startsWith('/supervisor/merchandise/pending-orders') && method === 'GET'){
        return actions.getPendingOrders(req,res);
    }

    if(url.startsWith('/supervisor/merchandise/merch') && method === 'GET'){
        return actions.getMerchandiseTable(req,res);
    }

    if(url.startsWith('/supervisor/merchandise/orders') && method === "GET"){
        return actions.getMerchandiseReordersTable(req,res);
    }

    if(url.startsWith('/supervisor/merchandise/add-merch') && method === 'POST'){
        return actions.addMerchandise(req,res);
    }

    if(url.startsWith('/supervisor/maintenance/maintenance-request') && method === "POST"){
        return actions.addMaintenanceRequest(req,res);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not handled by router' }));
}

module.exports = routes;