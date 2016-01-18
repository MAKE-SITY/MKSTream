angular.module('clientRoutes', [])

.config(['$stateProvider', function($stateProvider) {

  $stateProvider

    .state('home', {
    url: '/',
    templateUrl: './app/components/home/homeView.html'
  })
    .state('test', {
    url: '/test',
    templateUrl: './app/components/feat_sample/featView.html'
  })
    ;
}]);