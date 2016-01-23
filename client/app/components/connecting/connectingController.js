angular.module('connecting', [
    'utils'
  ])
.controller('connectingController', [
  '$scope',
  '$http',
  '$stateParams',
  'fileTransfer',
  'fileUpload',
  'linkGeneration',
  'webRTC',
  'fileReader',
  'packetHandlers',
  function($scope, $http, $stateParams, fileTransfer, fileUpload, linkGeneration, webRTC, fileReader, packetHandlers) {
  console.log('connecting controller loaded');
  /**
   * if arriving from redirect,
   * sender has access to their own peer object,
   * becasue it's on the fileTransfer
   *
   * if arriving from a link,
   * follow the code below:
   */
  fileTransfer.activeFileTransfers = {};
  fileTransfer.finishedTransfers = [];
  
  if (!fileTransfer.peer) {
    fileTransfer.myItems = [];

    fileTransfer.conn = [];


    fileTransfer.peer = webRTC.createPeer();

    fileTransfer.peer.on('open', function(id) {
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
        var conn = fileTransfer.peer.connect(res.data.senderID);
        fileTransfer.conn.push(conn);
        conn.on('data', function(data) {
          console.log('incoming packet');
          if (data.type === 'file-accepted') {
            packetHandlers.accepted(data, conn, fileTransfer);
          } else if (data.type === 'file-offer') {
            packetHandlers.offer(data, conn);
          } else if (data.type === 'file-chunk') {
            packetHandlers.chunk(data, fileTransfer);
          }
        });
      });
    });

    document.getElementById('filesId').addEventListener('change', function() {

      var files = this.files;
      for (var i = 0; i < files.length; i++) {
        files[i].beenSent = false;
        fileTransfer.myItems.push(files[i]);
      }
      fileTransfer.conn.forEach(function(connection){
        for (var i = 0; i < fileTransfer.myItems.length; i++) {
          if(!fileTransfer.myItems[i].beenSent){
            fileTransfer.myItems[i].beenSent = true;
            connection.send({
              name: fileTransfer.myItems[i].name,
              size: fileTransfer.myItems[i].size,
              type: 'file-offer'
            });
          }
        }
      });
      //TODO: send files back

    });
  }

}]);
