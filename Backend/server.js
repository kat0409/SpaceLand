const http = require('http');
const url = require('url');
const cors = require('cors');
const eRoutes = require('./routes');

//If you are calling a getter function, use GET
//If you are calling an add function, use POST

const corsMiddleWare = cors();

//GET: fetch data from the database
//POST: add data to the database
//PUT: update data in the database

// Define route handlers in a map for efficiency
const routeMap = {
    'GET': [
        '/rides', 
        '/supervisor/HR/employees', 
        '/merchandise', 
        '/maintenance', 
        '/merchandise-transactions', 
        '/supervisor/employees',
        '/supervisor/maintenance-requests',
        '/supervisor/merchandise/low-stock',
        '/supervisor/sales-report',
        '/supervisor/merchandise/ticket-sales',
        '/supervisor/HR/visitors',
        '/supervisor/merchandise/visitor-purchases',
        '/supervisor/maintenance/ride-maintenance',
        '/supervisor/HR/attendance-revenue',
        '/employee/account-info',
        '/supervisor/account-info',
        '/account-info',
        '/supervisor/merchandise/notifications',
        '/supervisor/merchandise/items',
        '/supervisor/merchandise/pending-orders',
        '/supervisor/merchandise/merch',
        '/supervisor/merchandise/orders',
        '/supervisor/maintenance/rides',
        '/supervisor/maintenance/employee-maintenance-request',
        '/supervisor/maintenance/ridemaintenance-pending',
        '/supervisor/maintenance/get-maintenance-requests',
        '/purchase-history',
        '/ticket-history',
        '/alerts',
        '/supervisor/HR/get-supervisors',
        '/supervisor/HR/get-departments',
        '/get-events',
        '/employee/get-schedule',
        '/employee/profile',
        '/supervisor/HR/get-employees-params',
        '/supervisor/HR/time-off-request',
        '/supervisor/merchandise/sales-report',
        '/supervisor/HR/employee-names',
        '/supervisor/HR/get-schedule',
        '/supervisor/HR/get-specific-schedule',
        '/supervisor/HR/shifts-with-names',
        '/supervisor/merchandise/transaction-summary',
        '/supervisor/merchandise/best-worst',
        '/supervisor/maintenance/employee-performance',
        '/supervisor/HR/all-employee-names',
        '/supervisor/HR/get-employee-department',
        '/supervisor/HR/attendance-report',
        "/get-merchandise",
        '/weather-alert'
    ],
    'POST': [
        '/supervisor/HR/add-employee', 
        '/add-merchandise-transaction',
        '/login',
        '/add-visitor',
        '/check-visitor',
        '/purchase-cosmic-pass',
        '/purchase-general-pass',
        '/supervisor/update-maintenance-status',
        '/supervisor/add-ride',
        '/supervisor/login',
        '/employee-login',
        '/supervisor/maintenance/insert-ride-maintenance',
        '/supervisor/maintenance/update-ride-maintenance-status',
        '/supervisor/merchandise/reorders',
        '/supervisor/merchandise/stock-arrivals',
        '/supervisor/merchandise/add-merch',
        '/supervisor/maintenance/maintenance-request',
        '/meal-plan-purchase',
        '/supervisor/HR/add-events',
        '/employee/time-off-request',
        '/employee/clock-in',
        '/employee/clock-out',
        '/supervisor/HR/schedule',
        '/supervisor/HR/fire-employee',
        "/resolve-weather-alert",
        "/payment-info"
    ],
    'PUT': [
        '/update-employee', 
        '/update-merchandise-quantity', 
        '/update-maintenance',
        '/supervisor/update-meal-plan',//make
        '/supervisor/update-employee-info',//make
        '/supervisor/update-visitor-info',//make
        '/supervisor/update-operating-hours',//make
        '/supervisor/update-event-date',//make
        '/supervisor/maintenance/complete-request',
        '/supervisor/HR/update-event',
        '/employee/clock-out',
        '/supervisor/HR/update-time-off-request',
        '/supervisor/HR/update-employee-profile',
    ],
    'DELETE': [
        '/supervisor/delete-employee',
        '/supervisor/delete-maintenance', 
        '/supervisor/delete-item',//make
        '/supervisor/delete-meal-plan',//make
        '/supervisor/delete-ride',//make
        '/supervisor/HR/delete-event',
        '/supervisor/HR/schedule-delete'
    ],
};

//connect shopping cart with ticket transactions and tickets
//add a trigger to email the maintenance employees of a ride that needs maintenance when it is marked as 1 in its maintenance need

/*const server = http.createServer((req, res) => {
    corsMiddleWare(req, res, () => {
        const parsedUrl = url.parse(req.url, true);
        const {pathname} = parsedUrl;
        const method = req.method;

        if(pathname === '/'){
            res.writeHead(200, {"Content-Type":"application/json"});
            res.end(JSON.stringify("From backend side"));
            return;
        }

        const isMatch  = (routeMap[method] || []).some(route =>
            pathname.startsWith(route)
        );

        if(isMatch){
            return eRoutes(req,res);
        }

        res.writeHead(404, {"Content-Type": "application/json"});
        res.end(JSON.stringify({error: "Route not found"}));
    });
});*/

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // OR better: "http://localhost:5173"
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }
  
    corsMiddleWare(req, res, () => {
      const parsedUrl = url.parse(req.url, true);
      const { pathname } = parsedUrl;
      const method = req.method;
  
      if (pathname === "/") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify("From backend side"));
        return;
      }
  
      const isMatch = (routeMap[method] || []).some(route =>
        pathname.startsWith(route)
      );
  
      if (isMatch) {
        return eRoutes(req, res);
      }
  
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Route not found" }));
    });
  });

const PORT  = process.env.PORT || 3000 //check if there is an environment variable

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});