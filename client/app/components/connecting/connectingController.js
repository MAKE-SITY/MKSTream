angular.module('connecting', [
    'utils'
  ])
  .controller('connectingController', ['$scope', '$http', '$stateParams', '$rootScope', 'fileUpload', 'linkGeneration', 'webRTC', 'fileReader', function($scope, $http, $stateParams, $rootScope, fileUpload, linkGeneration, webRTC, fileReader) {
    console.log('connecting controller loaded');
    /**
     * if arriving from redirect,
     * sender has access to their own peer object,
     * becasue it's on the $rootScope
     *
     * if arriving from a link,
     * follow the code below:
     */
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
            console.log('ehuh');
          var conn = $rootScope.peer.connect(res.data.senderID);
          $rootScope.conn.push(conn);
          conn.on('data', function(data) {
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
            else if (data.type === 'file-offer') {
              var answer = confirm('do you wish to receive ' + data.name + "?");
              if (answer) {
                conn.send({
                  name: data.name,
                  size: data.size,
                  type: 'file-accepted'
                });
              }
            } else if (data.type === 'file-transfer') {
              var file = new window.Blob([data.file]);
              var fileUrl = URL.createObjectURL(file);
              var downloadAnchor = document.getElementById('fileLink');
              downloadAnchor.download = data.name;
              downloadAnchor.href = fileUrl;
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
