var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

module.exports = function(app, express) {
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + './../../client'));
  app.use('/bower_components', express.static(__dirname + './../../bower_components'));

  //webRTC
  var webRTCRouter = express.Router();
  require('../routes/webRTC_routes.js')(webRTCRouter);
  app.use('/api/webrtc', webRTCRouter);
};