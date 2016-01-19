var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  linkHash: String,
  senderID: String,
  receiverID: Array
});

module.exports = mongoose.model('User', userSchema);