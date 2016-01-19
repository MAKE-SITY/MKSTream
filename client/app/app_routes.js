angular.module('clientRoutes', [])

.config(function($stateProvider) {

  $stateProvider

    .state('home', {
      url: '/',
      controller: 'homeController',
      templateUrl: './app/components/home/homeView.html'
    })
    .state('link', {
      url: '/:test',
      templateUrl: './app/components/feat_sample/featView.html'
    });
});
