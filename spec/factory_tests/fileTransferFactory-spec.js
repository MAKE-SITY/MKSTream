describe('fileTransferObj Factory', function() {
  var factory

  beforeEach(function() {
    //angular.module name
    module('utils.fileTransfer');

    inject(function($injector) {
      factory = $injector.get('fileTransfer') //.factory name
    });
  });

  describe('fileTransferObj', function() {
    it("Should return an empty object", function() {
      var myObj = Object.keys(fileTransferObj).length;
      expect(myObj).toEqual(0);
    });
  });
});