var express = require('express');
var port = process.env.PORT || 3000;
var app = express();



// app.get('/', function(req,res) {
//   res.send('Join the club');
// });

require('./config/middleware.js')(app, express);

app.listen(port);

console.log('Now listening on port: ' + port);