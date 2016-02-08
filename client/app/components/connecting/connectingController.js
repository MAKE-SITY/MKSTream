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
  'fileUpload',
  'modals',
  'linkGeneration',
  'lightningButton',
  'notifications',
  function($scope, $http, $stateParams, $rootScope, fileTransfer, webRTC, packetHandlers, fileUpload, modals, linkGeneration, lightningButton, notifications) {
    console.log('connecting controller loaded');
    /**
     * if arriving from redirect,
     * sender has access to their own peer object,
     * becasue it's on the fileTransfer
     *
     * if arriving from a link,
     * follow the code below:
     */

    fileUpload.checkBrowser();


    $rootScope.openModal = modals.openModal;
     

    $('.currentUrlShow').removeClass('currentUrlHidden');

    setTimeout(function() {
      currentUrl.innerHTML = window.location.href;

    }, 0);

    var disconnectingReceiverId = null;

    $scope.incomingFileTransfers = fileTransfer.incomingFileTransfers;
    $scope.outgoingFileTransfers = fileTransfer.outgoingFileTransfers;
    $scope.acceptFileOffer = fileUpload.acceptFileOffer;
    $scope.rejectFileOffer = fileUpload.rejectFileOffer;
    $scope.offers = fileTransfer.offers;
    console.log('connecting scope', $scope.offers);

    if (!fileTransfer.peer) {
      lightningButton.activateLightningButton();
      lightningButton.awaitingConnection();
      fileTransfer.myItems = [];

      fileTransfer.conn = [];

      fileTransfer.peer = webRTC.createPeer();

      fileTransfer.peer.on('open', function(id) {
        disconnectingReceiverId = id;
        $('.currentConnectionState').text('Connecting...');
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
            lightningButton.connectedToPeer();
            fileTransfer.conn.push(conn);
            packetHandlers.attachConnectionListeners(conn, $rootScope);
            notifications.tabReminder();
          });
      });

      window.onbeforeunload = function(e) {
        //stops notification from showing
        e.preventDefault();
      };

      window.addEventListener('beforeunload', function() {
        fileTransfer.peer.destroy();
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
        var self = this;
        $scope.$apply(function(){
          fileUpload.receiveFiles.call(self);
        })
      });
    }

  }
]);
