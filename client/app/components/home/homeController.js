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
  function($scope, $http, $state, $stateParams, $location, $rootScope, fileTransfer, linkGeneration, webRTC, packetHandlers, fileUpload, modals, notifications) {
    console.log('home controller loaded');
    fileTransfer.myItems = [];
    fileTransfer.conn = [];

    var disconnectingSenderId = null;
    var generateLink = function() {
      $scope.hash = linkGeneration.guid().then(function(val) {
        $scope.hash = val;
        $state.go('room', {
          roomHash: $scope.hash
        });
      });
    };

    $scope.openModal = modals.openModal;

    $scope.uploadAlert = true;

    $scope.uploadedFiles = {};

    $('#lightningBoltButton').hover(function() {
      $('#lightningBoltButton').addClass('lightningHover');
    }, function() {
      $('#lightningBoltButton').removeClass('lightningHover');
    })

    $('#lightningBoltButton').mousedown(function() {
      $('#lightningBoltButton').addClass('clicked');
    })

    $('#lightningBoltButton').mouseup(function() {
      $('#lightningBoltButton').removeClass('clicked');
    })

    document.getElementById('filesId').addEventListener('change', function() {

      $scope.uploadAlert = false;
      $('#lightningBoltButton').addClass('waitingForConnection');

      fileUpload.receiveFiles.call(this);

      fileTransfer.myItems.forEach(function(item, idx, collection) {
        $scope.uploadedFiles[idx] = {
          name: item.name,
          size: fileUpload.convertFileSize(item.size),
          type: item.type
        };
      });
      $scope.$apply();


      if (!fileTransfer.peer) {

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
          console.log('peerJS connection object', conn);
          $('.currentConnectionState').text('Connecting...');

          conn.on('open', function() {
            $('#lightningBoltButton').addClass('connectedToPeer');
            $('.currentConnectionState').text('Connected!');
            fileTransfer.connected = true;
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
