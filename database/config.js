var mongoose = require('mongoose');

var uri = (process.env.MONGOLAB_URI || 'mongodb://localhost/test');

mongoose.connect(uri);

var db = mongoose.connection;

db.on("error", console.error.bind(console, 'connection error:'));

db.once("open", function(callback) {
  console.log("We've opened a connection to the database");
});

module.exports = db;