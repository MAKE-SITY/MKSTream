angular.module('clientRoutes', [])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider
  .otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      controller: 'homeController',
      templateUrl: './app/components/home/homeView.html'
    })
    .state('room', {
      url: '/room/:roomHash',
      controller: 'connectingController',
      templateUrl: './app/components/connecting/featView.html'
    });
}]);