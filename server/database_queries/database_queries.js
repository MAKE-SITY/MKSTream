var User = require('./../../database/models/user_schema.js');
var db = require('./../../database/config.js');

var exportObj = {};

exportObj.addUser = function(linkHash, senderID, receiverID) {
  new User({
    linkHash: linkHash,
    senderID: senderID,
    receiverID: receiverID
  }).save(function(err, addedUser) {
    if(err) {
      console.log('error trying to save user to DB:', err);
    }
    console.log(addedUser, 'addedUser');
  });
};

var addReceiver = function(senderID, receiverID) {
  User.update({senderID: senderID}, {});
};

var deleteUser = function() {

};