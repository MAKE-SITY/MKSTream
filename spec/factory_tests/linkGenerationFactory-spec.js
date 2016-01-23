describe('linkGeneration Factory', function() {
  var factory;

  beforeEach(function() {
    //angular.module name
    module('utils.linkGeneration');

    inject(function($injector) {
      factory = $injector.get('linkGeneration') //.factory name
    });
  });

  describe('linkGenerationObj', function() {
    it("Should return an object with two methods", function() {
      var myObj = Object.keys(factory).length;
      expect(myObj).toEqual(2);
    });

    it("Should have a method called guid", function() {
      expect(factory.guid).toBeDefined();
    });

    it("Should have a method called fuid", function() {
      expect(factory.fuid).toBeDefined();
    });
  });
});