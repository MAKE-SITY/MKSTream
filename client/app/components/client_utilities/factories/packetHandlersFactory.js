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
        for (var i = 0; i < fileTransfer.myItems.length; i++) {
          if (fileTransfer.myItems[i].name === data.name && fileTransfer.myItems[i].size === data.size) {
            fileTransfer.myItems[i].status = "Sending...";
          }
        }
      }
    });
  };

  packetHandlers.offer = function(data, conn, scope) {
    scope.$apply(function() {
      var offer = {
        name: data.name,
        size: fileUpload.convertFileSize(data.size),
        conn: conn,
        fileKey: data.fileKey,
        rawSize: data.size
      };
      fileTransfer.offers.push(offer);
    });
  };

  packetHandlers.chunk = function(data, conn, scope) {
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
    if (data.count % 200 === 0) {
      // ping back progress to sender every 200 packets
      conn.send((fileTransfer.incomingFileTransfers[data.id].progress / fileTransfer.incomingFileTransfers[data.id].size * 100).toFixed(2));
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
                conn.send({
                  fileKey: data.id,
                  type: 'file-finished',
                  progress: '100%'
                });
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

  packetHandlers.finished = function(data, scope){
    for (var j = 0; j < fileTransfer.myItems.length; j++) {
      if (fileTransfer.myItems[j].fileKey === data.fileKey) {
        scope.$apply(function() {
          fileTransfer.myItems[j].status = 'File finished sending';
        });
      }
    }
  };

  packetHandlers.rejected = function(data, scope){
    for (var j = 0; j < fileTransfer.myItems.length; j++) {
      if (fileTransfer.myItems[j].fileKey === data.fileKey) {
        scope.$apply(function() {
          fileTransfer.myItems[j].status = 'File rejected';
        });
      }
    }
  };

  packetHandlers.attachConnectionListeners = function(conn, scope){
    conn.on('data', function(data) {
      // console.log('incoming packet');
      if (data.type === 'start-transfer') {
        packetHandlers.startTransfer(data, conn, scope);
      } else if (data.type === 'file-offer') {
        packetHandlers.offer(data, conn, scope);
      } else if (data.type === 'file-chunk') {
        packetHandlers.chunk(data, conn, scope);
      } else if (data.type === 'file-finished') {
        packetHandlers.finished(data, scope);
      } else if (data.type === 'file-rejected') {
        packetHandlers.rejected(data, scope);
      } else {
        console.log('RECEIVING EVERY 500 PACKETS, PROGRESS:', data);
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
