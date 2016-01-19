angular.module('utils', [])

.factory('webRTC', ['$http', function($http){
  /**
   * user uploaded file
   * retrieve file & convert it to binary
   **/ 

  var createPeer = function(){

    var peer = new Peer({
    config: {'iceServers': [
        {url:'stun:stun01.sipphone.com'},
        {url:'stun:stun.ekiga.net'},
        {url:'stun:stun.fwdnet.net'},
        {url:'stun:stun.ideasip.com'},
        {url:'stun:stun.iptel.org'},
        {url:'stun:stun.rixtelecom.se'},
        {url:'stun:stun.schlund.de'},
        {url:'stun:stun.l.google.com:19302'},
        {url:'stun:stun1.l.google.com:19302'},
        {url:'stun:stun2.l.google.com:19302'},
        {url:'stun:stun3.l.google.com:19302'},
        {url:'stun:stun4.l.google.com:19302'},
        {url:'stun:stunserver.org'},
        {url:'stun:stun.softjoys.com'},
        {url:'stun:stun.voiparound.com'},
        {url:'stun:stun.voipbuster.com'},
        {url:'stun:stun.voipstunt.com'},
        {url:'stun:stun.voxgratia.org'},
        {url:'stun:stun.xten.com'} ]
    },
    key: 'slp678osk0oa8aor'});
    //place key in env variable
    return peer;

  }

  
  var ping = function(conn){
    conn.send('hello world');
  };

  var getUsers = function(){
    return $http({
      method: 'GET',
      url: '/api/webrtc/users'
    })
  };
  //TODO:need an event listener for every time a file is added to send that file

  var connectToPeer = function(caller, targetId){
    var conn = caller.connect(targetId);
    return conn;
  }

  var sendData = function(conn, data, filename, size){
    conn.send({
      file: data,
      name: filename,
      size: size
    });
  }

  return {
    createPeer: createPeer,
    ping: ping,
    getUsers: getUsers,
    connectToPeer: connectToPeer,
    sendData: sendData
  };

}])

.factory('fileUpload', [function(){

  var getFiles = function(){
    return document.getElementById('filesId').files;
  };

  var convertToBinary = function(file){
    //TODO: make this
  }

  var convertFromBinary = function(data){
    var blob = new window.Blob(data.file);
    var kit = {};
    kit.href = URL.createObjectURL(blob);
    kit.name = data.name;
    kit.size = data.size;
    return kit;
  }

  return {
    getFiles: getFiles
  };

}]);