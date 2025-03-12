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
        '/employees', 
        '/merchandise', 
        '/maintenance', 
        '/merchandise-transactions', 
    ],
    'POST': [
        '/add-employee', 
        '/add-maintenance',
        '/add-merchandise-transaction',
        '/login',
        '/add-visitor',
        '/check-visitor',
        '/purchase-pass'
    ],
    'PUT': [
        '/update-employee', 
        '/update-merchandise-quantity', 
        '/update-maintenance', 
    ],
    'DELETE': [
        '/delete-employee',
        '/delete-maintenance', 
    ],
};

const server = http.createServer((req, res) => {
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
});

const PORT  = process.env.PORT || 3000 //check if there is an environment variable

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});