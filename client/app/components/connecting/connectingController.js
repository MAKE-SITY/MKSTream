angular.module('connecting', [
  'utils'
])

.controller('connectingController', [
  '$scope',
  '$http',
  '$stateParams',
  '$rootScope',
  'fileTransfer',
  'webRTC',
  'packetHandlers',
  function($scope, $http, $stateParams, $rootScope, fileTransfer, webRTC, packetHandlers) {
    console.log('connecting controller loaded');
    /**
     * if arriving from redirect,
     * sender has access to their own peer object,
     * becasue it's on the fileTransfer
     *
     * if arriving from a link,
     * follow the code below:
     */
    var clipboard = new Clipboard('.btn');
    document.getElementById('currentUrl').value = window.location.href;
    var disconnectingReceiverId = null;

    $scope.activeFileTransfers = fileTransfer.activeFileTransfers = {};
    fileTransfer.finishedTransfers = [];
    $scope.offers = fileTransfer.offers = [];

    if (!fileTransfer.peer) {
      fileTransfer.myItems = [];

      fileTransfer.conn = [];


      fileTransfer.peer = webRTC.createPeer();

      fileTransfer.peer.on('open', function(id) {
        disconnectingReceiverId = id;
        $http({
            method: 'POST',
            url: '/api/webrtc/users',
            data: {
              hash: $stateParams.roomHash,
              recipientId: id
            }
          })
          .then(function(res) {
            // expect res.data === sender id
            var conn = fileTransfer.peer.connect(res.data.senderID);
            fileTransfer.conn.push(conn);
            conn.on('data', function(data) {
              // console.log('incoming packet');
              if (data.type === 'file-accepted') {
                packetHandlers.accepted(data, conn, $rootScope);
              } else if (data.type === 'file-offer') {
                packetHandlers.offer(data, conn, $rootScope);
              } else if (data.type === 'file-chunk') {
                packetHandlers.chunk(data, $rootScope);
              }
            });
          });
      });

      window.onbeforeunload = function(e) {
        e.preventDefault();
        //stops notification from showing
      };

      window.addEventListener('beforeunload', function() {
        $http({
          method: 'POST',
          url: '/api/webrtc/deleteReceiverId',
          data: {
            hash: $stateParams.roomHash,
            id: disconnectingReceiverId
          }
        });
      });

      document.getElementById('filesId').addEventListener('change', function() {
        console.log('connecting input listener');
        var files = this.files;
        for (var i = 0; i < files.length; i++) {
          files[i].beenSent = false;
          fileTransfer.myItems.push(files[i]);
        }
        fileTransfer.conn.forEach(function(connection) {
          webRTC.clearQueue(fileTransfer.myItems, connection);
        });
        //TODO: send files back

      });
    }

  }
]);