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

  fileUploadObj.convert = function(num) {
    if (num > 1000000000) {
        return (num / 1000000000).toFixed(2) + ' GB'
    } else if (num > 1000000) {
        return (num / 1000000).toFixed(2) + ' MB'
    } else  {
        return (num / 1000).toFixed(2) + ' KB'
    }
  }

  return fileUploadObj;

}]);