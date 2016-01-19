var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  linkHash : String,
  senderID : String,
  receiverID : Number,
  created_at : Array
});