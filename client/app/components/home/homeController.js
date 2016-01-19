angular.module('home', [
  'utils'
])

.controller('homeController', ['$scope', '$state', '$stateParams', '$location', '$rootScope', 'fileUpload', 'linkGeneration', function($scope, $state, $stateParams, $location, $rootScope, fileUpload, linkGeneration) {
  $scope.myItems = [];
  $scope.file = 'sample.txt';

  $scope.generateLink = function() {
    $scope.hash = linkGeneration.guid();
    $stateParams.test = $scope.hash;
    $location.path('/' + $scope.hash);
    console.log($stateParams);
  };

  $scope.testParams = $stateParams;

  $scope.home = function() {
    $state.go('home');
  };

  $scope.home();

  $scope.clicker2 = function() {
    console.log('im executing');
  };

  $scope.fileGetTest = function() {
    $scope.myItems.push(fileUpload.getFiles());
    console.log($scope.myItems);
  };
}]);
