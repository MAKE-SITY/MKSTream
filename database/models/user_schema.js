var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  linkHash: String,
  senderID: String,
  receiverIDArray: [String]
});

module.exports = mongoose.model('User', userSchema);
