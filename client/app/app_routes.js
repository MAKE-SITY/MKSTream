angular.module('clientRoutes', [])

.config(['$stateProvider', function($stateProvider) {

  $stateProvider

    .state('home', {
    url: '/',
    controller: 'homeController',
    templateUrl: './app/components/home/homeView.html'
  })
    .state('test', {
    url: '/test/:index',
    templateUrl: './app/components/feat_sample/featView.html'
  });
}]);