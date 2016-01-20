angular.module('home', [
  'utils'
])

.controller('homeController', ['$scope', '$http', '$state', '$stateParams', '$location', '$rootScope', 'fileUpload', 'linkGeneration', 'webRTC', 'fileReader', function($scope, $http, $state, $stateParams, $location, $rootScope, fileUpload, linkGeneration, webRTC, fileReader) {
  $rootScope.myItems = [];
  $scope.file = 'sample.txt';

  var generateLink = function() {
    $scope.hash = linkGeneration.guid();
    $stateParams.test = $scope.hash;
    $location.path('/' + $scope.hash);
    console.log($stateParams);
  };

  document.getElementById('filesId').addEventListener('change', function() {

    var files = this.files;
    for (var i = 0; i < files.length; i++) {
      $rootScope.myItems.push(files[i]);
    }
    fileReader.readAsArrayBuffer($rootScope.myItems[0], $scope).then(function(result){
      console.dir(result);
    });


    if (!$rootScope.peer) {
      $rootScope.peer = webRTC.createPeer();
      $rootScope.peer.on('open', function(id) {
        // TODO: create special link to send with post in data
        $http({
          method: 'POST',
          url: '/api/webrtc/users',
          data: {
            userId: id,
            hash: $scope.hash
          }
        });
      });

      $rootScope.peer.on('connection', function(conn) {
        // TODO: add file inside call to send
        $rootScope.conn = conn;
        console.log('does this ever happen', conn);
        
        for (var i = 0; i < $rootScope.myItems.length; i++) {
          console.log('conn.send obj', {
            name: $rootScope.myItems[i].name,
            size: $rootScope.myItems[i].size,
          });
          conn.send({
            name: $rootScope.myItems[i].name,
            size: $rootScope.myItems[i].size,
            type: 'file-offer'
          });
        }

        $rootScope.conn.on('data', function(data) {
          if (data.type === 'file-accepted') {
            $rootScope.myItems.forEach(function(val) {
              if (val.name === data.name && val.size === data.size) {
                fileReader.readAsArrayBuffer(val, $scope)
                  .then(function(result) {
                    webRTC.sendData(conn, {
                      file: result,
                      name: data.name,
                      size: data.size,
                      type: 'file-transfer'
                    });
                  });
              }
            });
          }
          console.log('data response from bitches', data);
        });
      });
      generateLink();
    }
  });



  $scope.testParams = $stateParams;

  $scope.home = function() {
    $state.go('home');
  };

  $scope.home();

  $scope.clicker2 = function() {
    console.log('im executing');
  };

  $scope.fileGetTest = function() {
    $scope.myItems.push(fileUpload.getFiles());
    console.log($scope.myItems);
  };
}]);
