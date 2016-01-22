angular.module('utils', [])

.factory('webRTC', ['$http', 'fileReader', function($http, fileReader) {
  /**
   * user uploaded file
   * retrieve file & convert it to binary
   **/

  var createPeer = function() {

    var peer = new Peer({
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
        ]},
      key: 'slp678osk0oa8aor'
    });
    //place key in env variable
    return peer;

  };


  var ping = function(conn) {
    conn.send('hello world');
  };

  var getUsers = function() {
    return $http({
      method: 'GET',
      url: '/api/webrtc/users'
    });
  };
  //TODO:need an event listener for every time a file is added to send that file

  var connectToPeer = function(caller, targetId) {
    var conn = caller.connect(targetId);
    return conn;
  };

  var sendData = function(conn, obj) {
    conn.send(obj);
  };

  var sendDataInChunks = function(conn, obj) {
    var chunker = function(details, name){
      var chunkSize = 16384;
      var slice = details.file.slice(details.offset, details.offset + chunkSize);
      fileReader.readAsArrayBuffer(slice, details.scopeRef)
      .then(function(buff){
        var packet = {
          chunk: buff,
          type: 'file-chunk',
          count: details.count,
          id: details.id
        };
        if(details.count === 0){
          packet.name = name;
          packet.size = details.size;
        } else if(details.offset + chunkSize > details.size) {
          packet.last = true;
        }
        details.conn.send(packet);
        details.count++;
        if(details.size > details.offset + chunkSize){
          details.offset += chunkSize;
          window.setTimeout(function(details){
            chunker(details);
          }, 0, details);
        } else {
          console.log('File finished sending!');
        }
      })
    }
    chunker({
      id: obj.id,
      count: 0,
      offset: 0,
      size: obj.size,
      conn: conn,
      file: obj.file,
      scopeRef: obj.scopeRef
    }, obj.name)
  };

  var transferConstructor = function(){
    var store = {};

  }

  return {
    createPeer: createPeer,
    ping: ping,
    getUsers: getUsers,
    connectToPeer: connectToPeer,
    sendData: sendData,
    sendDataInChunks: sendDataInChunks
  };

}])

.factory('linkGeneration', [function(){
  var guid = function() {
    var s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
  };

  var fuid = function() {
    var s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return s4() + s4() + s4() + s4();
  };


  return {
    guid: guid,
    fuid: fuid
  };
}])

.factory('fileReader', ['$q', '$log', function($q, $log) {
  var onLoad = function(reader, deferred, scope) {
    return function() {
      scope.$apply(function() {
        deferred.resolve(reader.result);
      });
    };
  };

  var onError = function(reader, deferred, scope) {
    return function() {
      scope.$apply(function() {
        deferred.reject(reader.result);
      });
    };
  };

  var onProgress = function(reader, scope) {
    return function(event) {
      scope.$broadcast('fileProgress', {
        total: event.total,
        loaded: event.loaded
      });
    };
  };

  var getReader = function(deferred, scope) {
    var reader = new FileReader();

    reader.onload = onLoad(reader, deferred, scope);
    reader.onerror = onError(reader, deferred, scope);
    reader.onprogress = onProgress(reader, scope);

    return reader;
  };

  var readAsArrayBuffer = function(file, scope) {
    var deferred = $q.defer();

    var reader = getReader(deferred, scope);
    reader.readAsArrayBuffer(file);

    return deferred.promise;
  };

  return {
    readAsArrayBuffer: readAsArrayBuffer
  };


}])

.factory('fileUpload', ['fileReader', function(fileReader) {

  var getFiles = function() {
    return document.getElementById('filesId').files;
  };

  var convertFromBinary = function(data) {
    var blob = new window.Blob(data.file);
    var kit = {};
    kit.href = URL.createObjectURL(blob);
    kit.name = data.name;
    kit.size = data.size;
    return kit;
  };

  var fileBufferConstructor = function(){
    var idStore = {
      count: 0
    };

    var setUpFileBuffer = function(){
      idStore[idStore.count] = [];
      idStore.count++;
      return {};
    }

  };


  return {
    getFiles: getFiles,
    convertFromBinary: convertFromBinary
  };

}])

.factory('packetHandlers', ['webRTC', 'fileUpload', 'linkGeneration', function(webRTC, fileUpload, linkGeneration){

  var accepted = function(data, conn, scope){
    var fileKey = linkGeneration.fuid()

    scope.myItems.forEach(function(val) {
      if (val.name === data.name && val.size === data.size) {
        webRTC.sendDataInChunks(conn, {
          file: val,
          name: data.name,
          size: data.size,
          id: fileKey,
          scopeRef: scope
        });
      }
    })

  }

  var offer = function(data, conn){
    var answer = confirm('do you wish to receive ' + data.name + "?");
    if (answer) {
      conn.send({
        name: data.name,
        size: data.size,
        type: 'file-accepted'
      });
    }
  }

  var chunk = function(data, scope){
    var bar = document.getElementById('progressBar');
    if(data.count === 0){
      scope.activeFileTransfers[data.id] = {
        buffer: [],
        id: data.id,
        name: data.name,
        size: data.size
      };
      scope.progress = 0;
      bar.max = data.size;
    }
    var transferObj = scope.activeFileTransfers[data.id];
    transferObj.buffer[data.count] = data.chunk;
    scope.progress += 16348;
    bar.value = scope.progress;
    if (data.last) {
      console.log('last chunk', transferObj);
      var newFile = fileUpload.convertFromBinary({
        file: transferObj.buffer,
        name: transferObj.name,
        size: transferObj.size
      });
      scope.finishedTransfers.push(newFile);
      transferObj.buffer = [];
      var downloadAnchor = document.getElementById('fileLink');
      downloadAnchor.download = newFile.name;
      downloadAnchor.href = newFile.href;
    }
  }

  return {
    accepted: accepted,
    offer: offer,
    chunk: chunk
  }

}]);