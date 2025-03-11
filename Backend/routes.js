const actions = require('./actions'); 
const {URL} = require('url');

function routes(req, res) {
    const url =  req.url;
    const method = res.method;

    if(url === '/rides' && method === 'GET'){
        actions.getRides(req,res);
    }
    else if(url === '/employees' && method === 'GET'){
        actions.getEmployees(req,res);
    }
};