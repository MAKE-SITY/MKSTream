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
  'fileUpload',
  'modals',
  'notifications',
  'lightningButton',
  function($scope, $http, $state, $stateParams, $location, $rootScope, fileTransfer, linkGeneration, webRTC, packetHandlers, fileUpload, modals, notifications, lightningButton) {
    console.log('home controller loaded');
    fileTransfer.myItems = [];
    fileTransfer.conn = [];

    var disconnectingSenderId = null;
    var generateLink = function() {
      $scope.hash = linkGeneration.adjAdjAnimal().then(function(val) {
        $scope.hash = val;
        $state.go('room', {
          roomHash: $scope.hash
        });
      });
    };

    $rootScope.openModal = modals.openModal;


    $scope.uploadedFiles = {};

    

    document.getElementById('filesId').addEventListener('change', function() {
      
      $('#alertMessage').text('Click the bolt to copy the link to your clipboard');

      fileUpload.receiveFiles.call(this);

      if (!fileTransfer.peer) {
        lightningButton.activateLightningButton();
        lightningButton.awaitingConnection();
        lightningButton.addLinkToLightningButton();

        fileTransfer.peer = webRTC.createPeer();
        console.log('SENDER peer created');
        fileTransfer.peer.on('open', function(id) {
          disconnectingSenderId = id;
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
          fileTransfer.conn.push(conn);
          lightningButton.connectedToPeer();

          conn.on('open', function() {
            fileTransfer.conn.forEach(function(connection) {
              webRTC.clearQueue(fileTransfer.myItems, connection);
            });
          });
          packetHandlers.attachConnectionListeners(conn, $rootScope);
        });
        generateLink();
      }

      window.onbeforeunload = function(e) {
        e.preventDefault();
        //stops notification from showing
      };

      window.addEventListener('beforeunload', function() {
        fileTransfer.peer.destroy();
        $http({
          method: 'POST',
          url: '/api/webrtc/deleteSenderObject',
          data: {
            userId: disconnectingSenderId
          }
        });
      });

    });


  }]);
