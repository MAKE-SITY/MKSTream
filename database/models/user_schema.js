var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  linkHash: {type: String},
  senderID: {type: String},
  receiverID: {type: Array}
});

module.exports = mongoose.model('User', userSchema);