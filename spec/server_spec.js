var request = require('request');
// var server = require('./../server/server.js');
var base_url = 'http://localhost:5000/';

describe("Home page", function() {

  it("should respond with status code 200", function(done) {
    request(base_url, function(error, response, body) {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});
