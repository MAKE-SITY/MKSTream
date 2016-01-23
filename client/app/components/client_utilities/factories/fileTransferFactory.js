angular.module('utils.fileTransfer', [])

.factory('fileTransfer', function() {
  fileTransferObj = {};
  fileTransferObj.myItems = [];
  fileTransferObj.conn = [];
  fileTransferObj.activeFileTransfers = {};
  fileTransferObj.finishedTransfers = [];
  fileTransferObj.peer;

  return fileTransferObj;
})