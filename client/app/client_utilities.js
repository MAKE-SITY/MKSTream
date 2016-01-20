angular.module('utils', [])

.factory('webRTC', ['$http', function($http) {
  /**
   * user uploaded file
   * retrieve file & convert it to binary
   **/

  var createPeer = function() {

    var peer = new Peer({
      config: {
        'iceServers': [{
          url: 'stun:stun01.sipphone.com'
        }, {
          url: 'stun:stun.ekiga.net'
        }, {
          url: 'stun:stun.fwdnet.net'
        }, {
          url: 'stun:stun.ideasip.com'
        }, {
          url: 'stun:stun.iptel.org'
        }, {
          url: 'stun:stun.rixtelecom.se'
        }, {
          url: 'stun:stun.schlund.de'
        }, {
          url: 'stun:stun.l.google.com:19302'
        }, {
          url: 'stun:stun1.l.google.com:19302'
        }, {
          url: 'stun:stun2.l.google.com:19302'
        }, {
          url: 'stun:stun3.l.google.com:19302'
        }, {
          url: 'stun:stun4.l.google.com:19302'
        }, {
          url: 'stun:stunserver.org'
        }, {
          url: 'stun:stun.softjoys.com'
        }, {
          url: 'stun:stun.voiparound.com'
        }, {
          url: 'stun:stun.voipbuster.com'
        }, {
          url: 'stun:stun.voipstunt.com'
        }, {
          url: 'stun:stun.voxgratia.org'
        }, {
          url: 'stun:stun.xten.com'
        }]
      },
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

  return {
    createPeer: createPeer,
    ping: ping,
    getUsers: getUsers,
    connectToPeer: connectToPeer,
    sendData: sendData
  };

}])

.factory('fileUpload', [function() {

  var getFiles = function() {
    return document.getElementById('filesId').files;
  };

  var convertToBinary = function(file) {
    //TODO: make this
  };

  var convertFromBinary = function(data) {
    var blob = new window.Blob(data.file);
    var kit = {};
    kit.href = URL.createObjectURL(blob);
    kit.name = data.name;
    kit.size = data.size;
    return kit;
  };

  return {
    getFiles: getFiles
  };

}])

.factory('linkGeneration', [function() {
  var guid = function() {
    var s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
  };

  return {
    guid: guid
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


}]);
