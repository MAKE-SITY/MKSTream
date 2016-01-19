angular.module('home', [])

.controller('homeController', function($scope, $state, $stateParams) {

  $scope.guid = function() {
    var s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
  }
  $scope.file = 'sample.txt';

  $scope.generateLink = function() {
    $scope.hash = $scope.guid($scope.userType);
    $stateParams.test = $scope.hash;
  };

  $scope.goToLink = function() {
    $state.go('link');
  }
  $scope.testParams = $stateParams;
  $state.go('home');
});
