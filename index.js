var express  = require('express');
var app      = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var serverOne = 'http://localhost:3001';

app.use('/static', express.static(__dirname));

app.all("*", function(req, res) {
    req.headers['host'] = 'services.odata.org'
    console.log(req.headers)
    apiProxy.web(req, res, { target: 'http://services.odata.org/' });
});

app.listen(3000);
