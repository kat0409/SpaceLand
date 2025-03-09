const http = require('http')

const server = http.createServer((request, response) => {

})

const PORT  = process.env.PORT || 5000 //check if there is an environment variable

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))