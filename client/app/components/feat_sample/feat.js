angular.module('feat', [])

  .controller('featController',function($scope, $state) {
    
    $scope.clicker = function() {
      console.log('im executing');
      $state.go('test');
    }
  });

