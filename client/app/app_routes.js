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
      views: {
        'connecting':{  
          controller: 'connectingController'
          // templateUrl: './app/components/connecting/featView.html'
        },
        'upload':{  
          controller: 'uploadController',
          templateUrl: './app/components/connecting/uploadView.html'
        },
        'download':{
          controller: 'downloadController',
          templateUrl: './app/components/connecting/downloadView.html'
        }
      }
    });
}]);
