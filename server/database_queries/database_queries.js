var User = require('./../../database/models/user_schema.js');
var db = require('./../../database/config.js');

var exportObj = {};

exportObj.addLink = function(linkHash, senderID) {
  return new User({
    linkHash: linkHash,
    senderID: senderID,
    receiverIDArray: []
  }).save(function(err, addedUser) {
    if(err) {
      console.log('error trying to save user to DB:', err);
    } else {
      console.log('addedUser:', addedUser);
    }
  });
};

exportObj.addReceiverToSender = function(linkHash, receiverID) {
  console.log('addRECEIVERToSEnder firing event');
  return User.findOneAndUpdate(
    {linkHash: linkHash},
    {$push: {receiverIDArray: receiverID}},
    {safe: true, upsert: true}
  );
};

exportObj.deleteLink = function(senderID) {
  return User.find({senderID: senderID}).remove(function(err) {
    if (err) {
      console.log('could not delete', senderID, ':', err);
    } else {
      console.log('deleted', senderID);
    }
  });
};

exportObj.getSenderId = function(linkHash) {
  return User.findOne({linkHash: linkHash}, function(err, user) {
    if (err) {
      console.log('could not get user', user, ':', err);
    } else {
      console.log('retrieved senderID:', user.senderID, 'from linkHash', linkHash);
    }
  });
};

exportObj.removeReceiverFromSender = function(linkHash, receiverID) {
  return User.findOneAndUpdate(
  {linkHash: linkHash},
  {$pull: {receiverIDArray: receiverID}}
  );
};


module.exports = exportObj;