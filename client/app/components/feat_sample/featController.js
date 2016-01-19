angular.module('feat', [])

.controller('featController', function($scope, $stateParams, $state) {
  console.log($stateParams);
  $scope.link = $stateParams.test;
});
