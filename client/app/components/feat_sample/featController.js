angular.module('feat', [])

.controller('featController', function($scope, $stateParams, $state) {
  $scope.link = $stateParams.test;
});
