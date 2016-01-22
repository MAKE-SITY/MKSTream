angular.module('connecting', [
    'utils'
  ])
.controller('connectingController', ['$scope', '$http', '$stateParams', '$rootScope', 'fileUpload', 'linkGeneration', 'webRTC', 'fileReader', 'packetHandlers', function($scope, $http, $stateParams, $rootScope, fileUpload, linkGeneration, webRTC, fileReader, packetHandlers) {
  console.log('connecting controller loaded');
  /**
   * if arriving from redirect,
   * sender has access to their own peer object,
   * becasue it's on the $rootScope
   *
   * if arriving from a link,
   * follow the code below:
   */
  $rootScope.activeFileTransfers = {};
  $rootScope.finishedTransfers = [];
  
  if (!$rootScope.peer) {
    $rootScope.myItems = [];

    $rootScope.conn = [];


    $rootScope.peer = webRTC.createPeer();

    $rootScope.peer.on('open', function(id) {
      $http({
        method: 'POST',
        url: '/api/webrtc/users',
        data: {
          hash: $stateParams.test,
          recipientId: id
        }
      })
      .then(function(res) {
        // expect res.data === sender id
        var conn = $rootScope.peer.connect(res.data.senderID);
        $rootScope.conn.push(conn);
        conn.on('data', function(data) {
          console.log('incoming packet');
          if (data.type === 'file-accepted') {
            packetHandlers.accepted(data, val, $rootScope);
          } else if (data.type === 'file-offer') {
            packetHandlers.offer(data, conn);
          } else if (data.type === 'file-chunk') {
            packetHandlers.chunk(data, $rootScope);
          }
        });
      });
    });

    document.getElementById('filesId').addEventListener('change', function() {

      var files = this.files;
      for (var i = 0; i < files.length; i++) {
        files[i].beenSent = false;
        $rootScope.myItems.push(files[i]);
      }
      $rootScope.conn.forEach(function(connection){
        for (var i = 0; i < $rootScope.myItems.length; i++) {
          if(!$rootScope.myItems[i].beenSent){
            $rootScope.myItems[i].beenSent = true;
            connection.send({
              name: $rootScope.myItems[i].name,
              size: $rootScope.myItems[i].size,
              type: 'file-offer'
            });
          }
        }
      })
      //TODO: send files back

    });
  }

}]);
