angular.module('home', [
  'utils'
])

.controller('homeController', ['$scope', '$http', '$state', '$stateParams', '$location', '$rootScope', 'fileUpload', 'linkGeneration', 'webRTC', 'fileReader', 'packetHandlers', function($scope, $http, $state, $stateParams, $location, $rootScope, fileUpload, linkGeneration, webRTC, fileReader, packetHandlers) {
  console.log('home controller loaded');
  $rootScope.myItems = [];
  $rootScope.conn = [];
  var generateLink = function() {
    $scope.hash = linkGeneration.guid();
    $stateParams.test = $scope.hash;
    $location.path('/' + $scope.hash);
  };

  document.getElementById('filesId').addEventListener('change', function() {

    var files = this.files;
    for (var i = 0; i < files.length; i++) {
      if($rootScope.myItems.indexOf(files[i]) > -1){
        continue;
      }
      files[i].beenSent = false;
      $rootScope.myItems.push(files[i]);
    }


    if (!$rootScope.peer) {

      $rootScope.peer = webRTC.createPeer();
      console.log('SENDER peer created');
      $rootScope.peer.on('open', function(id) {
        // TODO: create special link to send with post in data
        $http({
          method: 'POST',
          url: '/api/webrtc/users',
          data: {
            userId: id,
            hash: $scope.hash
          }
        })
        .then(function(result){
          console.log('SENDER\'s POST response', result.data);
        });
      });

      $rootScope.peer.on('connection', function(conn) {
        // TODO: add file inside call to send
        $rootScope.conn.push(conn);
        console.log('peerJS connection object', conn);

        setTimeout(function(){
          $rootScope.conn.forEach(function(connection){
            for (var i = 0; i < $rootScope.myItems.length; i++) {
              if(!$rootScope.myItems[i].beenSent){
                $rootScope.myItems[i].beenSent = true;
                console.log('files offered');
                connection.send({
                  name: $rootScope.myItems[i].name,
                  size: $rootScope.myItems[i].size,
                  type: 'file-offer'
                });
              }
            }
          })
        }, 1800);

        conn.on('data', function(data) {
          if (data.type === 'file-accepted') {
            packetHandlers.accepted(data, conn, $rootScope);
          } else if (data.type === 'file-offer') {
            packetHandlers.offer(data, conn);
          } else if (data.type === 'file-chunk') {
            packetHandlers.chunk(data, $rootScope);
          }
        });
      });
      generateLink();
    }
  });



  $scope.testParams = $stateParams;


}]);
