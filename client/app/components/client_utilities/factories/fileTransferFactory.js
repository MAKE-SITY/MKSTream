angular.module('utils.fileTransfer', [])

.factory('fileTransfer', function() {
  
  var fileTransferObj = {};

	fileTransferObj.incomingFileTransfers = {};
  fileTransferObj.outgoingFileTransfers = {};
  fileTransferObj.finishedTransfers = [];
  fileTransferObj.offers = [];

  return fileTransferObj;
  
});