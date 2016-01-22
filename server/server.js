var express = require('express');
var port = process.env.PORT || 3000;
// var peerPort = process.env.PEERPORT || 9000;
var app = express();

require('./config/middleware.js')(app, express);

var server = app.listen(port);

console.log('Now listening on port: ' + port);


// create express peer server
var ExpressPeerServer = require('peer').ExpressPeerServer;
var options = {
    debug: true
};

app.use('/peerjs', ExpressPeerServer(server, options));
