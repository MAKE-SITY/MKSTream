document.addEventListener('DOMContentLoaded', function(){
  var port = chrome.runtime.connect({name: "knockknock"});
  port.postMessage({hello: "goodbye"});
  // port.onMessage.addListener(function(msg) {

  // });
  document.getElementById('fileId').addEventListener('change', function(){
      var files = this.files;
      for(var i = 0; i < files.length; i++){
        console.log(files[i]);
        port.postMessage(JSON.stringify({file: files[i]}));
      }
  });
});