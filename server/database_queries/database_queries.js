var User = require('./../../database/models/user_schema.js');
var db = require('./../../database/config.js');

var exportObj = {};

exportObj.addUser = function(linkHash, senderID, receiverID) {
  new User({
    linkHash: linkHash,
    senderID: senderID,
    receiverIDArray: receiverID
  }).save(function(err, addedUser) {
    if(err) {
      console.log('error trying to save user to DB:', err);
    } else {
      console.log('addedUser:', addedUser);
    }
  });
};

exportObj.addReceiver = function(senderID, receiverID) {
  User.findOneAndUpdate(
    {senderID: senderID},
    {$push: {receiverIDArray: receiverID}},
    {safe: true, upsert: true},
    function(err, model) {
      console.log(err);
    }
  );
};

exportObj.deleteUser = function(senderID) {
  User.find({senderID: senderID}).remove(function(err) {
    if (err) {
      console.log('could not delete', senderID, ':', err);
    } else {
      console.log('deleted', senderID);
    }
  }).exec();
};
