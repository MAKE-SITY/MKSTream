angular.module('utils.fileUpload', ['utils.fileReader'])

.factory('fileUpload', ['fileReader', function(fileReader) {
  var fileUploadObj = {};

  fileUploadObj.getFiles = function() {
    return document.getElementById('filesId').files;
  };

  fileUploadObj.convertFromBinary = function(data) {
    var kit = {};
    kit.href = URL.createObjectURL(data.file);
    kit.name = data.name;
    kit.size = data.size;
    return kit;
  };

  return fileUploadObj;

}]);