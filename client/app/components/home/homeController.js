angular.module('home', [])

.controller('homeController', function($scope, $state, $stateParams, $location) {

  $scope.guid = function() {
    var s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
  }
  $scope.file = 'sample.txt';

  $scope.generateLink = function() {
    $scope.hash = $scope.guid();
    $stateParams.test = $scope.hash;
    $location.path('/' + $scope.hash);
  };

  $scope.testParams = $stateParams;

  $scope.home = function() {
    $state.go('home');
  }
  $scope.home();

});
