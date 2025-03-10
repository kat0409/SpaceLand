const http = require('http');
const mysql = require('mysql2');
const url = require('url')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'space_land2025',
    password: '$paceland25',
    database: 'space_land_25'
});

connection.connect((err) => {
    if(err){
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database!');
});

/*const server = http.createServer((request, response) => {
    const parsedURL = url.parse(request.url, true);
    const queryParameters = parse

    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html') //header is where we put the content type, authorization tokens, etc.; second parameter is the content type
    response.write('<h1> Hello World </h1>') //what we send back to the client through the server
    response.end()
    
})*/

const PORT  = process.env.PORT || 3000 //check if there is an environment variable

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))