angular.module('utils.packetHandlers', ['utils.webRTC', 'utils.fileUpload', 'utils.linkGeneration'])


.factory('packetHandlers', ['webRTC', 'fileUpload', 'linkGeneration', 'fileTransfer', '$q', function(webRTC, fileUpload, linkGeneration, fileTransfer, $q) {
  var packetHandlerObj = {};
  var fileNumber = 0;
  var fullArray = [];
  // for transfer rate
  var currentBytes = 0;
  var getTransferRate = function(transferObj) {
      var currentTime = Date.now();
      var timeToWait = 500; // ms
      if (currentTime >= transferObj.nextTime) {
        transferObj.nextTime = Date.now() + timeToWait;
        var pastBytes = currentBytes;
        currentBytes = transferObj.progress;
        var rate = ((currentBytes - pastBytes)) / (timeToWait) // bytes/ms i.e. KB/s
        console.log('CURRENT BYTES', currentBytes);
        console.log('PASTCOUNT', pastBytes);
        console.log('DIFFERENCE', currentBytes - pastBytes);
        var maxFileSize = transferObj.size;
        timeRemaining = (maxFileSize - currentBytes) / rate; // bytes / bytes/ms -> ms
        console.log('maxFileSize', maxFileSize);
        console.log('REMAINING BYTES', maxFileSize - currentBytes);
        console.log('RATE:', rate / 1000, 'MB/S'); // KB/s / 1000 -> MB/s
        console.log('TIME REMAINING:', (timeRemaining / 1000).toFixed(0), 's')
      }
    }
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
      var offer = {
        name: data.name,
        size: fileUpload.convert(data.size),
        conn: conn,
        rawSize: data.size
      };
      fileTransfer.offers.push(offer);
    });
  };

  packetHandlerObj.chunk = function(data, scope) {
    if (data.count === 0) {
      scope.$apply(function() {
        fileTransfer.incomingFileTransfers[data.id] = {
          buffer: [],
          id: data.id,
          name: data.name,
          size: data.size,
          progress: 0,
          fileNumber: fileNumber,
          chunkCount: 0,
          // used for transfer rate
          transferred: 0,
          nextTime: Date.now()
        };
      });
      fileNumber++;
    }
    var transferObj = fileTransfer.incomingFileTransfers[data.id];
    transferObj.buffer.push(data.chunk);
    scope.$apply(function() {
      transferObj.progress += 16384;
    });
    // for transfer rate
    
    getTransferRate(transferObj);
    // this code takes the data off browser memory and stores to user's temp storage every 5000 packets.
    if (transferObj.buffer.length >= 5000) {
      console.log('saved chunk at', transferObj.buffer.length);
      var blobChunk = new Blob(transferObj.buffer);
      transferObj.buffer = [];
      localforage.setItem(data.id + ':' + transferObj.chunkCount.toString(), blobChunk);
      transferObj.chunkCount++;
    }

    if (data.last) {
      var lastBlob = new Blob(transferObj.buffer);
      transferObj.buffer = [];
      localforage.setItem(data.id + ':' + transferObj.chunkCount.toString(), lastBlob, function() {
          console.log('saved last chunk');
        })
        .then(
          function(result) {
            // console.log('first promise resolved');
            transferObj.chunkCount++;
            localforage.iterate(function(value, key, iterationNumber) {
                console.log('DB KEY', key);
                console.log('DB VALUE', value);
                if (key.startsWith(data.id)) {
                  fullArray[key.split(':')[1]] = value;
                  // delete doucment after appending
                  localforage.removeItem(key);
                  console.log('Removed key:', key)
                }
                // clear this document from db after
              }, function(err) {
                if (err) {
                  console.log('Error iterating through db!:', err);
                } else {
                  console.log('Iteration has completed');
                }
              })
              .then(function() {
                // console.log('all promise resolved');
                var newFile = fileUpload.convertFromBinary({
                  file: new Blob(fullArray),
                  name: transferObj.name,
                  size: transferObj.size
                });
                fullArray = [];

                fileTransfer.finishedTransfers.push(newFile);
                var downloadAnchor = document.getElementById('file' + transferObj.fileNumber);
                downloadAnchor.download = newFile.name;
                downloadAnchor.href = newFile.href;
              });
          }
        );
    }
  };

  return packetHandlerObj;

}]);
