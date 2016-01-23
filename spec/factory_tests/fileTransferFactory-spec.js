describe('fileTransferObj Factory', function() {
  var factory;
  beforeEach(function() {
    //angular.module name
    module('utils.fileTransfer');
  });
  beforeEach(function() {
    inject(function($injector) {
      factory = $injector.get('fileTransfer') //.factory name
    });
  });

  describe('fileTransferObj', function() {
    console.log(factory);
    it("Should return an empty object", function() {
      var myObj = Object.keys(factory).length;
      expect(myObj).toEqual(0);
    });
  });
});