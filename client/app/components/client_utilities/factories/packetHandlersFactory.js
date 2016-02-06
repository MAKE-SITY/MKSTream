angular.module('utils.packetHandlers', ['utils.webRTC', 'utils.fileUpload', 'utils.linkGeneration'])


.factory('packetHandlers', [
  'webRTC', 
  'fileUpload', 
  'linkGeneration', 
  'fileTransfer',
  'notifications',
  'lightningButton',
  function(webRTC, fileUpload, linkGeneration, fileTransfer, notifications, lightningButton) {
  var packetHandlers = {};
  var fileNumber = 0;
  var fullArray = [];
  packetHandlers.startTransfer = function(data, conn, scope) {
    fileTransfer.myItems.forEach(function(val) {
      if (val.name === data.name && val.size === data.size) {
        var sendData = {
          file: val,
          name: data.name,
          size: data.size,
          id: data.fileKey,
          scopeRef: scope
        };
        webRTC.sendDataInChunks(conn, sendData);
      }
    });
  };

  packetHandlers.offer = function(data, conn, scope) {
    scope.$apply(function() {
      var offer = {
        name: data.name,
        size: fileUpload.convertFileSize(data.size),
        conn: conn,
        rawSize: data.size
      };
      fileTransfer.offers.push(offer);
    });
  };

  packetHandlers.chunk = function(data, scope) {
    if (data.count === 0) {
      scope.$apply(function() {
        fileTransfer.incomingFileTransfers[data.id] = {
          buffer: {},
          id: data.id,
          name: data.name,
          size: data.size,
          formattedSize: fileUpload.convertFileSize(data.size),
          progress: 0,
          fileNumber: fileNumber,
          chunkCount: 0,
          // used for transfer rate
          stored: 0,
          nextTime: Date.now()
        };
      });
      fileNumber++;
    }
    var blockSize = 5000;
    var transferObj = fileTransfer.incomingFileTransfers[data.id];
    var blockIndex = Math.floor(data.count/blockSize);
    var relativeIndex = data.count % blockSize;
    if(!transferObj.buffer[blockIndex]){
      transferObj.buffer[blockIndex] = [];
      transferObj.buffer[blockIndex].chunksReceived = 0;
    }
    var block = transferObj.buffer[blockIndex];
    block[relativeIndex] = data.chunk;
    block.chunksReceived++;
    scope.$apply(function() {
      transferObj.progress += 16384;
      transferObj.rate = fileUpload.getTransferRate(transferObj).rate;
      transferObj.time = fileUpload.getTransferRate(transferObj).time;
      if (transferObj.progress > transferObj.size) {
        transferObj.progress = transferObj.size;
        transferObj.rate = 0.00;
      }
      transferObj.percent = (transferObj.progress/transferObj.size*100).toFixed(2).toString() + '%';
    });
    
    if (transferObj.progress >= transferObj.size) {
      var lastBlob = new Blob(block);
      block = transferObj.buffer[blockIndex] = null;
      localforage.setItem(data.id + ':' + transferObj.chunkCount.toString(), lastBlob)
        .then(
          function(result) {
            transferObj.chunkCount++;
            localforage.iterate(function(value, key, iterationNumber) {
                if (key.startsWith(data.id)) {
                  fullArray[key.split(':')[1]] = value;
                  // delete document after appending
                  localforage.removeItem(key);
                  console.log('Removed key:', key);
                }
                // clear this document from db after
              }, function(err) {
                if (err) {
                  console.log('Error iterating through db!:', err);
                } else {
                  console.log('localforage iteration completed');
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
                notifications.successMessage(newFile.name);
                fileTransfer.downloadQueue.shift();
                webRTC.checkDownloadQueue();
              });
          }
        );
    } else if (block.chunksReceived === blockSize) {
    // this code takes the data off browser memory and stores to user's temp storage
      console.log('saved block at ', blockSize, 'chunks');
      var blobChunk = new Blob(block);
      block = transferObj.buffer[blockIndex] = null;
      localforage.setItem(data.id + ':' + transferObj.chunkCount.toString(), blobChunk);
      transferObj.chunkCount++;
    }
  };

  packetHandlers.attachConnectionListeners = function(conn, scope){
    conn.on('data', function(data) {
      console.log('incoming packet');
      if (data.type === 'start-transfer') {
        packetHandlers.startTransfer(data, conn, scope);
        // TODO: Update DOM after status update
        fileTransfer.status = 'SENDING!!!!!!!';
      } else if (data.type === 'file-offer') {
        packetHandlers.offer(data, conn, scope);
      } else if (data.type === 'file-chunk') {
        packetHandlers.chunk(data, scope);
      }
    });

    conn.on('error', function(err){
      console.log('connection error: ', err);
    });

    conn.on('close', function(){
      notifications.connectionLost();
      lightningButton.disconnected();
    });
  };

  return packetHandlers;

}]);
