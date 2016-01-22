angular.module('utils.fileUpload', ['utils.fileReader'])

.factory('fileUpload', ['fileReader', function(fileReader) {
  var fileUploadObj = {};

  fileUploadObj.getFiles = function() {
    return document.getElementById('filesId').files;
  };

  fileUploadObj.convertFromBinary = function(data) {
    var blob = new window.Blob(data.file);
    var kit = {};
    kit.href = URL.createObjectURL(blob);
    kit.name = data.name;
    kit.size = data.size;
    return kit;
  };

  return fileUploadObj;

}]);