angular.module('utils.webRTC', ['utils.fileReader'])

.factory('webRTC', ['$http', 'fileReader', 'fileTransfer', function($http, fileReader, fileTransfer) {
  /**
   * user uploaded file
   * retrieve file & convert it to binary
   **/
  var webRTC = {};

  webRTC.createPeer = function() {
    var peer = new Peer({　
      host: 'mkstream.herokuapp.com',
      secure: true,
      port: 443,
      config: {
        'iceServers': [
          {url: 'stun:stun01.sipphone.com'}, 
          {url: 'stun:stun.ekiga.net'}, 
          {url: 'stun:stun.fwdnet.net'}, 
          {url: 'stun:stun.ideasip.com'}, 
          {url: 'stun:stun.iptel.org'}, 
          {url: 'stun:stun.rixtelecom.se'}, 
          {url: 'stun:stun.schlund.de'}, 
          {url: 'stun:stun.l.google.com:19302'}, 
          {url: 'stun:stun1.l.google.com:19302'}, 
          {url: 'stun:stun2.l.google.com:19302'}, 
          {url: 'stun:stun3.l.google.com:19302'}, 
          {url: 'stun:stun4.l.google.com:19302'}, 
          {url: 'stun:stunserver.org'}, 
          {url: 'stun:stun.softjoys.com'}, 
          {url: 'stun:stun.voiparound.com'}, 
          {url: 'stun:stun.voipbuster.com'}, 
          {url: 'stun:stun.voipstunt.com'}, 
          {url: 'stun:stun.voxgratia.org'}, 
          {url: 'stun:stun.xten.com'}
          ]
      },
      debug: 3
    });

    webRTC.heartBeat(peer);

    return peer;

  };

  webRTC.heartBeat = function(peer) {
    var alive = true;
    var makeHeartbeat = function() {
      if (alive) {
        setTimeout(makeHeartbeat, 20000);
        if (peer.socket._wsOpen()) {
          peer.socket.send({type: 'HEARTBEAT'});
        }
      }
    };
    makeHeartbeat();
    return {
      start: function() {
        alive = true;
        makeHeartbeat();
      },
      stop: function() {
        alive = false;
      }
    };
  };

  var chunker = function(details, name) {
    var chunkSize = 16384;
    var slice = details.file.slice(details.offset, details.offset + chunkSize);
    fileReader.readAsArrayBuffer(slice, details.scopeRef)
      .then(function(buff) {
        var packet = {
          chunk: buff,
          type: 'file-chunk',
          count: details.count,
          id: details.id
        };
        if (details.count === 0) {
          packet.name = name;
          packet.size = details.size;
        } 
        details.conn.send(packet);
        console.log('BufferSize:', details.conn.bufferSize);
        details.count++;
        if (details.size > details.offset + chunkSize) {
          details.offset += chunkSize;
          if(details.conn.bufferSize > 1000){
            // if buffer queue exceeds 1000, wait for user's client to process first
            window.setTimeout(function(details) {
              chunker(details);
            }, 150, details);
          } else {
            window.setTimeout(function(details) {
              chunker(details);
            }, 0, details);
          }
        } else {
          console.log('File finished sending!');
        }
      });
  };

  webRTC.sendDataInChunks = function(conn, obj) {
    fileTransfer.outgoingFileTransfers[obj.id] = {
      progress: 0,
      max: obj.size,
      name: obj.name
    };
    chunker({
      id: obj.id,
      count: 0,
      offset: 0,
      size: obj.size,
      conn: conn,
      file: obj.file,
      scopeRef: obj.scopeRef
    }, obj.name);
  };

  webRTC.clearQueue = function(files, conn){
    for(var i = 0; i < files.length; i++){
      if(!files[i].beenSent){
        files[i].beenSent = true;
        conn.send({
          name: files[i].name,
          size: files[i].size,
          fileKey: files[i].fileKey,
          type: 'file-offer'
        });
      }
    }
  };

  webRTC.checkDownloadQueue = function(){
    var first = fileTransfer.downloadQueue[0];
    if(fileTransfer.downloadQueue.length === 0){
      console.log('download queue empty');
    }
    else if(!first.sending){
      console.log('starting download');
      first.sending = true;
      first.conn.send({
        name: first.name,
        size: first.rawSize,
        fileKey: first.fileKey,
        type: 'start-transfer'
      });
    }
  };

  return webRTC;

}]);
