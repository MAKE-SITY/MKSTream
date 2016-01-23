angular.module('home', [
  'utils'
])

.controller('homeController', [
  '$scope',
  '$http',
  '$state',
  '$stateParams',
  '$location',
  'fileTransfer',
  'linkGeneration',
  'webRTC',
  'packetHandlers',
  function($scope, $http, $state, $stateParams, $location, fileTransfer, linkGeneration, webRTC, packetHandlers) {
    console.log('home controller loaded');

    fileTransfer.myItems = [];
    fileTransfer.conn = [];

    var disconnectingSenderId = null;
    var generateLink = function() {
      $scope.hash = linkGeneration.guid();
      $stateParams.test = $scope.hash;
      $location.path('/' + $scope.hash);
    };

    document.getElementById('filesId').addEventListener('change', function() {

      var files = this.files;
      for (var i = 0; i < files.length; i++) {
        if (fileTransfer.myItems.indexOf(files[i]) > -1) {
          continue;
        }
        files[i].beenSent = false;
        fileTransfer.myItems.push(files[i]);
      }


      if (!fileTransfer.peer) {

        fileTransfer.peer = webRTC.createPeer();
        console.log('SENDER peer created');
        fileTransfer.peer.on('open', function(id) {
          disconnectingSenderId = id;
          // TODO: create special link to send with post in data
          $http({
              method: 'POST',
              url: '/api/webrtc/users',
              data: {
                userId: id,
                hash: $scope.hash
              }
            })
            .then(function(result) {
              console.log('SENDER\'s POST response', result.data);
            });
        });

        fileTransfer.peer.on('connection', function(conn) {
          // TODO: add file inside call to send
          fileTransfer.conn.push(conn);
          console.log('peerJS connection object', conn);

          setTimeout(function() {
            fileTransfer.conn.forEach(function(connection) {
              for (var i = 0; i < fileTransfer.myItems.length; i++) {
                if (!fileTransfer.myItems[i].beenSent) {
                  fileTransfer.myItems[i].beenSent = true;
                  console.log('files offered');
                  connection.send({
                    name: fileTransfer.myItems[i].name,
                    size: fileTransfer.myItems[i].size,
                    type: 'file-offer'
                  });
                }
              }
            });
          }, 1800);

          conn.on('data', function(data) {
            if (data.type === 'file-accepted') {
              packetHandlers.accepted(data, conn, $scope);
            } else if (data.type === 'file-offer') {
              packetHandlers.offer(data, conn);
            } else if (data.type === 'file-chunk') {
              packetHandlers.chunk(data, fileTransfer);
            }
          });
        });
        generateLink();
      }

      window.onbeforeunload = function() {
        return ("Your connection will end");
      };

      window.addEventListener('beforeunload', function() {
        console.log("DISCONNECTED")
        $http({
          method: 'POST',
          url: '/api/webrtc/deleteSenderObject',
          data: {
            userId: disconnectingSenderId
          }
        })
      });

    });

    $scope.testParams = $stateParams;

  }
]);
