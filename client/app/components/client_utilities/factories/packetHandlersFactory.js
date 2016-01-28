angular.module('utils.packetHandlers', ['utils.webRTC', 'utils.fileUpload', 'utils.linkGeneration'])


.factory('packetHandlers', ['webRTC', 'fileUpload', 'linkGeneration', 'fileTransfer', '$q', function(webRTC, fileUpload, linkGeneration, fileTransfer, $q) {
  var packetHandlerObj = {};
  var chunkCount = 0;
  var fullArray = [];
  packetHandlerObj.accepted = function(data, conn, scope) {
    var fileKey = linkGeneration.fuid();

    fileTransfer.myItems.forEach(function(val) {
      if (val.name === data.name && val.size === data.size) {
        webRTC.sendDataInChunks(conn, {
          file: val,
          name: data.name,
          size: data.size,
          id: fileKey,
          scopeRef: scope
        });
      }
    });
  };

  packetHandlerObj.offer = function(data, conn, scope) {
    scope.$apply(function() {
      var index = fileTransfer.offers.length;
      fileTransfer.offers.push({
        name: data.name,
        size: data.size,
        accept: function() {
          conn.send({
            name: data.name,
            size: data.size,
            type: 'file-accepted'
          });
          fileTransfer.offers.splice(index, 1);
        }
      });
    });
  };

  packetHandlerObj.chunk = function(data, scope) {
    if (data.count === 0) {
      scope.$apply(function() {
        fileTransfer.activeFileTransfers[data.id] = {
          buffer: [],
          id: data.id,
          name: data.name,
          size: data.size,
          progress: 0
        };
      });
    }
    var transferObj = fileTransfer.activeFileTransfers[data.id];
    transferObj.buffer.push(data.chunk);
    scope.$apply(function() {
      transferObj.progress += 16348;
    });

    if (transferObj.buffer.length >= 1000) {
      console.log('saved chunk at', transferObj.buffer.length);
      var blobChunk = new Blob(transferObj.buffer);
      localforage.setItem(chunkCount.toString(), blobChunk);
      chunkCount++;
      transferObj.buffer = [];
    }

    if (data.last) {
      var lastBlob = new Blob(transferObj.buffer);
      transferObj.buffer = [];
      localforage.setItem(chunkCount.toString(), lastBlob, function() {
          console.log('saved last chunk');
        })
        .then(

          function(result) {
            console.log('first promise resolved');
            chunkCount++;
            localforage.iterate(function(value, key, iterationNumber) {
              fullArray[key] = value;
            }, function(err) {
              if (!err) {
                console.log('Iteration has completed');
              }
            })
        .then(function() {
          console.log('all promise resolved');
          var newFile = fileUpload.convertFromBinary({
            file: new Blob(fullArray),
            name: transferObj.name,
            size: transferObj.size
          });
          fullArray = [];
          fileTransfer.finishedTransfers.push(newFile);
          var downloadAnchor = document.getElementById('fileLink');
          downloadAnchor.download = newFile.name;
          downloadAnchor.href = newFile.href;
        })
            
          }

        )
    }
  };

  return packetHandlerObj;

}]);
