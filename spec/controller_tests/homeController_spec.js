xdescribe('homeController', function() {
  var $scope,
      $http,
      // $state,
      // $stateParams,
      $location,
      $rootScope,
      fileTransfer,
      linkGeneration,
      webRTC,
      packetHandlers;

  beforeEach(function() {
      module('home');
  
      inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        $http = $injector.get('$http');
        // $state = $injector.get('$state');
        // $stateParams = $injector.get('$stateParams');
        $location = $injector.get('$location');
        fileTransfer = $injector.get('fileTransfer');
        linkGeneration = $injector.get('linkGeneration');
        webRTC = $injector.get('webRTC');
        packetHandlers = $injector.get('packetHandlers');

      });
  });

  describe('home', function() {
    it("Should contain an object called fileTransfer", function() {
      expect(fileTransfer).toEqual({});
    });

    it("Should contain a key called 'myItems' that is an array", function() {
      console.log('THIS IS FILE TRANSFER', fileTransfer);
      expect($scope.x).toEqual('x');
    });
  });
});