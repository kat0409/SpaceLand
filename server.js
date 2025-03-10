const http = require('http')

const server = http.createServer((request, response) => {
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html') //header is where we put the content type, authorization tokens, etc.; second parameter is the content type
    response.write('<h1> Hello World </h1>') //what we send back to the client through the server
    response.end()
})

const PORT  = process.env.PORT || 3000 //check if there is an environment variable

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))