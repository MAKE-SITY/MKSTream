var mongoose = require('mongoose');

var uri = (process.env.MONGOLAB_URI || 'mongodb://localhost/MKStream');

var options = {
  server: {
    socketOptions:{
      keepAlive: 1,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions:{
      keepAlive: 1,
      connectTimeoutMS: 30000
    }
  }
};

mongoose.connect(uri, options);

var db = mongoose.connection;

db.on("error", console.error.bind(console, 'connection error:'));

db.once("open", function(callback) {
  console.log("We've opened a connection to the database");
});

module.exports = db;