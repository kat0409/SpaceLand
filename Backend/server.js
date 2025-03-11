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

const routes = {
    'GET' : [

    ]
};

const server = http.createServer((request, response) => {

});

const PORT  = process.env.PORT || 3000 //check if there is an environment variable

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});