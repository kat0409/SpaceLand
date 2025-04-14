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

    if (url.startsWith('/supervisor/HR/add-employee') && method === 'POST') {
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
    }

    if (url.startsWith('/supervisor/update-maintenance-status') && method === 'POST') {
        return actions.updateMaintenanceStatus(req, res);
    }

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
    }

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

    if(url.startsWith('/supervisor/merchandise/delete-item/') && method === 'DELETE'){
        return actions.deleteMerchandise(req,res);
    }

    if(url.startsWith('/supervisor/merchandise/update-item') && method === 'PUT'){
        return actions.updateMerchandise(req,res);
    }

    if(url.startsWith('/supervisor/merchandise/sales-data') && method === 'GET'){
        return actions.getMerchandiseSalesData(req,res);
    }

    if(url.startsWith('/supervisor/maintenance/maintenance-request') && method === "POST"){
        return actions.addMaintenanceRequest(req,res);
    }

    if(url.startsWith('/supervisor/maintenance/rides') && method === "GET"){
        return actions.getRidesForMaintenanceRequest(req,res);
    }

    if(url.startsWith('/supervisor/maintenance/employee-maintenance-request') && method === "GET"){
        return actions.getEmployeesForMaintenanceRequest(req,res);
    }

    if(url.startsWith('/supervisor/maintenance/complete-request') && method === "PUT"){
        return actions.completeMaintenanceRequest(req,res);
    }

    if(url.startsWith('/supervisor/maintenance/ridemaintenance-pending') && method === "GET"){
        return actions.getPendingMaintenance(req,res);
    }

    if(url.startsWith('/supervisor/maintenance/get-maintenance-requests') && method === "GET"){
        return actions.getMaintenanceRequests(req,res);
    }

    if(url.startsWith('/purchase-history') && method === "GET"){
        return actions.getVisitorMerchPurchases(req,res);
    }

    if(url.startsWith('/ticket-history') && method === "GET"){
        return actions.getVisitorTicketTransactions(req,res);
    }

    if(url.startsWith('/alerts') && method === "GET"){
        return actions.getHomePageAlerts(req,res);
    }

    if(url.startsWith('/supervisor/HR/get-supervisors') && method === "GET"){
        return actions.getSupervisorNames(req,res);
    }

    if(url.startsWith('/supervisor/HR/get-departments') && method === 'GET'){
        return actions.getDepartmentNames(req,res);
    }

    if(url.startsWith('/meal-plan-purchase') && method === "POST"){
        return actions.addMealPlanTransaction(req,res);
    }

    if(url.startsWith('/get-events') && method === "GET"){
        return actions.getEvents(req,res);
    }

    if(url.startsWith('/supervisor/HR/add-events') && method === "POST"){
        return actions.addEvent(req,res);
    }

    if(url.startsWith('/supervisor/HR/update-event') && method === "PUT"){
        return actions.updateEvent(req,res);
    }
    
    if(url.startsWith('/supervisor/HR/delete-event') && method === "DELETE"){
        return actions.deleteEvent(req,res);
    }

    if(url.startsWith('/employee/get-schedule') && method === "GET"){
        return actions.getEmployeeSchedule(req,res);
    }

    if(url.startsWith('/employee/time-off-request') && method === "POST"){
        return actions.requestTimeOff(req,res);
    }

    if(url.startsWith('/employee/clock-in') && method === "POST"){
        return actions.clockIn(req,res);
    }

    if(url.startsWith('/employee/clock-out') && method === "POST"){
        return actions.clockOut(req,res);
    }

    if(url.startsWith('/employee/profile') && method === "GET"){
        return actions.getEmployeeProfile(req,res);
    }

    if(url.startsWith('/supervisor/HR/get-employees-params') && method === "GET"){
        return actions.getFilteredEmployees(req,res);
    }

    if(url.startsWith('/supervisor/HR/schedule') && method === "POST"){
        return actions.addEmployeeSchedule(req,res);
    }

    if(url.startsWith('/supervisor/HR/schedule-delete') && method === "DELETE"){
        return actions.deleteEmployeeSchedule(req,res);
    }

    if(url.startsWith('/supervisor/HR/time-off-request') && method === "GET"){
        return actions.getTimeOffRequests(req,res);
    }

    if(url.startsWith('/supervisor/HR/update-time-off-request') && method === "PUT"){
        return actions.updateTimeOffRequestStatus(req,res);
    }

    if(url.startsWith('/supervisor/HR/update-employee-profile') && method === "PUT"){
        return actions.updateEmployeeProfile(req,res);
    }

    if(url.startsWith('/supervisor/HR/fire-employee') && method === "POST"){
        return actions.deleteEmployee(req,res);
    }

    if(url.startsWith('/supervisor/merchandise/sales-report') && method === "GET"){
        return actions.getFilteredSalesReport(req,res);
    }

    if(url.startsWith('/supervisor/HR/employee-names') && method === "GET"){
        return actions.getEmployeeNames(req,res);
    }

    if(url.startsWith('/supervisor/HR/get-schedule') && method === "GET"){
        return actions.getEmployeeScheduleForSup(req,res);
    }

    if(url.startsWith('/supervisor/HR/get-specific-schedule') && method === "GET"){
        return actions.getSpecificEmployeeSchedule(req,res);
    }

    if (url.startsWith('/supervisor/HR/shifts-with-names') && method === "GET") {
        return actions.getSchedulesWithNames(req, res);
    }

    if (url.startsWith('/supervisor/merchandise/transaction-summary') && method === "GET") {
        return actions.getTransactionSummaryReport(req, res);
    }

    if (url.startsWith('/supervisor/merchandise/best-worst') && method === "GET") {
        return actions.getBestWorstSellersReport(req, res);
    }

    if (url.startsWith('/supervisor/maintenance/employee-performance') && method === "GET") {
        return actions.maintenanceEmployeePerformanceReport(req, res);
    }

    if (url.startsWith('/supervisor/HR/all-employee-names') && method === 'GET') {
        return actions.getAllEmployees(req, res);
    }   
    
    if(url.startsWith('/supervisor/HR/get-employee-department') && method === 'GET'){
        return actions.getDepartmentByEmployeeID(req,res);
    }

    if (url.startsWith('/supervisor/HR/attendance-report') && method === "GET") {
        return actions.getAttendanceReport(req, res);
    }  

    if (url.startsWith("/get-merchandise") && method === "GET") {
        return actions.getMerchandiseItems(req, res);
    }    

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not handled by router' }));
}

module.exports = routes;