describe('fileTransferObj Factory', function() {
  var factory;
  beforeEach(function() {
    module('utils.fileTransfer'); //angular.module name

    inject(function($injector) {
      factory = $injector.get('fileTransfer'); //.factory name
    });
  });

  describe('fileTransferObj', function() {
    it("Should return an empty object", function() {
      var myObj = Object.keys(factory).length;
      expect(myObj).toEqual(0);
    });
  });
});