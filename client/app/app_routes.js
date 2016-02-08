angular.module('clientRoutes', [])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider
    .otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      controller: 'homeController'
    })
    .state('room', {
      url: '/room/:roomHash',
      views: {
        'connecting': {
          controller: 'connectingController'
        },
        'upload': {
          controller: 'uploadController',
          templateUrl: './app/components/upload/uploadView.html'
        },
        'download': {
          controller: 'downloadController',
          templateUrl: './app/components/download/downloadView.html'
        }
      }
    });
}]);
