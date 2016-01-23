var request = require('request');
var base_url = 'http://localhost:3000/';
var db = require('./../database/config.js');
var server = require('./../server/server.js');
var dbQueries = require('./../server/database_queries/database_queries.js');
var User = require('./../database/models/user_schema.js');

var testNumber = 1;

beforeEach(function() {
  console.log('======Starting test #', testNumber);
});

afterEach(function() {
  console.log('=======Finished test #', testNumber);
  testNumber++;
});


describe("Server", function() {
  it("should respond with status code 200", function(done) {
    request(base_url, function(error, response, body) {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it("addLink should be able to add an item to the database", function(done) {
    dbQueries.addLink('Test Hash MKS', 'Test Sender MKS').then(function() {
      User.findOne({
        linkHash: 'Test Hash MKS'
      }, function(err, user) {
        if (err) {
          return err;
        }
      }).then(function(result) {
        expect(result.senderID).toBe('Test Sender MKS');
        done();
      });
    });
  });

  it("addReceiverToSender should be able to add a receiverID to a sender", function(done) {
    dbQueries.addReceiverToSender('Test Hash MKS', 'Test Receiver MKS').then(function() {
      User.findOne({
        linkHash: 'Test Hash MKS'
      }, function(err, user) {
        if (err) {
          return err;
        }
      }).then(function(result) {
        console.log('result:', result);
        expect(result.receiverIDArray[result.receiverIDArray.length - 1]).toBe('Test Receiver MKS');
        done();
      });
    });
  });

  it("getSenderId be able to get user object from a link hash", function(done) {
    dbQueries.getSenderId('Test Hash MKS').then(
      function(result) {
        expect(result.senderID).toBe('Test Sender MKS');
        done();
      });
  });

  it("should be able to delete a particular receiverID from a sender", function(done) {
    dbQueries.removeReceiverFromSender('Test Hash MKS', 'Test Receiver MKS').then(function() {
      User.find({linkHash: 'Test Hash MKS'}, function(err, user) {
        if (err) {
          return err;
        }
      }).size('receiverIDArray', 0).then(function(result) {
        expect(result[0].senderID).toBe('Test Sender MKS');
        done();
      })
    })
  });

  it("should be able to delete an item from the database", function(done) {
    dbQueries.deleteLink('Test Sender MKS').then(function() {
      User.findOne({
        senderID: 'Test Sender MKS'
      }, function(err, user) {
        if (err) {
          return err;
        }
      }).then(function(result) {
        expect(result).toBe(null);
        done();
      });
    })
  });


});
