angular.module('utils.fileTransfer', [])

.factory('fileTransfer', function() {
  
  var fileTransfer = {};

	fileTransfer.incomingFileTransfers = {};
  fileTransfer.outgoingFileTransfers = {};
  fileTransfer.finishedTransfers = [];
  fileTransfer.offers = [];
  fileTransfer.downloadQueue = [];
  fileTransfer.status = 'Pending...';
  return fileTransfer;
  
});