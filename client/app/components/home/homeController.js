angular.module('home', [
  'utils'
])

.controller('homeController', [
  '$scope',
  '$http',
  '$state',
  '$stateParams',
  '$location',
  '$rootScope',
  'fileTransfer',
  'linkGeneration',
  'webRTC',
  'packetHandlers',
  function($scope, $http, $state, $stateParams, $location, $rootScope, fileTransfer, linkGeneration, webRTC, packetHandlers) {
    console.log('home controller loaded');

    fileTransfer.myItems = [];
    fileTransfer.conn = [];

    var disconnectingSenderId = null;
    var generateLink = function() {
      $scope.hash = linkGeneration.guid();
      $state.go('room', {
        roomHash: $scope.hash
      });
    };

    

    $scope.uploadAlert = true;

    document.getElementById('filesId').addEventListener('change', function() {
      
      $scope.uploadAlert = false;
      $('#lightningBoltButton').addClass('glowing');



      console.log('home input listener');
      var files = this.files;
      for (var i = 0; i < files.length; i++) {
        if (fileTransfer.myItems.indexOf(files[i]) > -1) {
          continue;
        }
        files[i].beenSent = false;
        fileTransfer.myItems.push(files[i]);
      }

      if (fileTransfer.connected) {
        fileTransfer.conn.forEach(function(connection) {
          webRTC.clearQueue(fileTransfer.myItems, connection);
        });
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

          conn.on('open', function() {
            fileTransfer.connected = true;
            fileTransfer.conn.forEach(function(connection) {
              webRTC.clearQueue(fileTransfer.myItems, connection);
            });
          });


          conn.on('data', function(data) {
            console.log('incoming packet');
            if (data.type === 'file-accepted') {
              packetHandlers.accepted(data, conn, $rootScope);
            } else if (data.type === 'file-offer') {
              packetHandlers.offer(data, conn, $rootScope);
            } else if (data.type === 'file-chunk') {
              packetHandlers.chunk(data, $rootScope);
            }
          });
        });
        generateLink();
      }

      window.onbeforeunload = function(e) {
        e.preventDefault();
        //stops notification from showing
      };

      window.addEventListener('beforeunload', function() {
        console.log("DISCONNECTED");
        $http({
          method: 'POST',
          url: '/api/webrtc/deleteSenderObject',
          data: {
            userId: disconnectingSenderId
          }
        });
      });

    });


  }
]);