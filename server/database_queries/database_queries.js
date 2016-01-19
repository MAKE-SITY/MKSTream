var User = require('./../database/models/user_schema');

var exportObj = {};

exportObj.addUser = function(linkHash, senderID, receiverID) {
  new User({
    linkHash: linkHash
    senderID: senderID
    receiverID: receiverID
  }).save(function(err) {
    if(err) {
      console.log('error trying to save user to DB', err);
    }
  });
};

var addReceiver = function() {

}

var deleteUser = function() {

}

module.exports = exportObj;