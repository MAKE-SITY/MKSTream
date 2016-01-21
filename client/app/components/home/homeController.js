angular.module('home', [
  'utils'
])

.controller('homeController', ['$scope', '$http', '$state', '$stateParams', '$location', '$rootScope', 'fileUpload', 'linkGeneration', 'webRTC', 'fileReader', function($scope, $http, $state, $stateParams, $location, $rootScope, fileUpload, linkGeneration, webRTC, fileReader) {
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
                connection.send({
                  name: $rootScope.myItems[i].name,
                  size: $rootScope.myItems[i].size,
                  type: 'file-offer'
                });
              }
            }
          })
        }, 500);

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
      generateLink();
    }
  });



  $scope.testParams = $stateParams;


}]);
