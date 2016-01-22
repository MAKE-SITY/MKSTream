var express = require('express');
var port = process.env.PORT || 3000;
var peerPort = process.env.PEERPORT || 9000;
var app = express();

require('./config/middleware.js')(app, express);

app.listen(port);

console.log('Now listening on port: ' + port);


// create express peer server
var ExpressPeerServer = require('peer').ExpressPeerServer;
var options = {
    debug: true
};
// create a http server instance to listen to request
var server = require('http').createServer(app);
// peerjs is the path that the peerjs server will be connected to.
app.use('/peerjs', ExpressPeerServer(server, options));
// Now listen to your ip and port.
server.listen(peerPort, "localhost");