describe('fileTransfer Factory', function() {
  var factory;
  beforeEach(function() {
    module('utils'); //angular.module name

    inject(function($injector) {
      factory = $injector.get('fileTransfer'); //.factory name
    });
  });

  describe('fileTransfer', function() {
    it("Should return an object with 5 keys", function() {
      var myObj = Object.keys(factory).length;
      expect(myObj).toEqual(5);
    });
  });
});