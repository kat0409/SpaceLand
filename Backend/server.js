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
        '/supervisor/merchandise/items'
    ],
    'POST': [
        '/add-employee', 
        '/add-maintenance',
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
        '/supervisor/merchandise/reorders'
    ],
    'PUT': [
        '/update-employee', 
        '/update-merchandise-quantity', 
        '/update-maintenance',
        '/supervisor/update-meal-plan',//make
        '/supervisor/update-employee-info',//make
        '/supervisor/update-visitor-info',//make
        '/supervisor/update-operating-hours',//make
        '/supervisor/update-event-date'//make
    ],
    'DELETE': [
        '/supervisor/delete-employee',
        '/supervisor/delete-maintenance', 
        '/supervisor/delete-item',//make
        '/supervisor/delete-meal-plan',//make
        '/supervisor/delete-ride'//make
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
    // ✅ Allow CORS manually
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