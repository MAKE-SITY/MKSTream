angular.module('clientRoutes', [])

  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {

    $stateProvider

      .state('test', {
        url: '/test',
        templateUrl: './app/components/feat_sample/feat.html'
      })
  }])