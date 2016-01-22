var request = require('request');
var base_url = 'http://localhost:3000/';
var db = require('./../database/config.js');
var server = require('./../server/server.js');
var dbQueries = require('./../server/database_queries/database_queries.js');
var User = require('./../database/models/user_schema.js');

describe("Server", function() {
  it("should respond with status code 200", function(done) {
    console.log('starting test 1');
    request(base_url, function(error, response, body) {
      expect(response.statusCode).toBe(200);
      console.log('done with test 1');
      done();
    });
  });

  // it("should be able to add an item to the database", function(done) {
  //   console.log('starting test 2');
  //   dbQueries.addLink('Test Hash MKS', 'Test Sender MKS').then(function() {
  //     User.findOne({
  //       linkHash: 'Test Hash MKS'
  //     }, function(err, user) {
  //       if (err) {
  //         return err;
  //       }
  //     }).then(function(result) {
  //       expect(result.senderID).toBe('Test Sender MKS');
  //       done();
  //       console.log('done with test 2');
  //     });
  //   });
  // });

  // it("should be able to add a receiverID to a sender", function(done) {
  //   console.log('starting test 3');
  //   dbQueries.addReceiverToSender('Test Hash MKS', 'Test Receiver MKS').then(function() {
  //     User.findOne({
  //       linkHash: 'Test Hash MKS'
  //     }, function(err, user) {
  //       if (err) {
  //         return err;
  //       }
  //     }).then(function(result) {
  //       console.log('Receiver ID Array:', result);
  //       expect(result.receiverIDArray[result.receiverIDArray.length - 1]).toBe('Test Receiver MKS');
  //       done();
  //       console.log('done with test 3');
  //     });
  //   });
  // });

  // it("should be able to get senderID from a link hash", function(done) {
  //   console.log('starting test 4');
  //   dbQueries.getSenderId('Test Hash MKS').then(
  //     function(result) {
  //       console.log('result', result)
  //       expect(result).toBe('Test Sender MKS');
  //       done();
  //     })
  //   console.log('done with test 4');
  // });

  // xit("should be able to delete an item from the database", function(done) {
  //   dbQueries.deleteLink('senderID1');
  //   User.findOne({
  //     senderID: 'senderID1'
  //   }, function(err, user) {
  //     if (err) {
  //       return err;
  //     }
  //   }).then(function(result) {
  //     expect(result.senderID).toBe(null);
  //     done();
  //   });
  // });
});
