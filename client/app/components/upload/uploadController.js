angular.module('upload', [
  'utils',
  'ngAnimate'
])

.controller('uploadController', [
  '$scope',
  'fileTransfer',
  'fileUpload',
  function($scope, fileTransfer, fileUpload) {
    console.log('upload controller loaded');

    $scope.incomingFileTransfers = fileTransfer.incomingFileTransfers;
    $scope.outgoingFileTransfers = fileTransfer.outgoingFileTransfers;
    $scope.acceptFileOffer = fileUpload.acceptFileOffer;
    $scope.rejectFileOffer = fileUpload.rejectFileOffer;
    $scope.offers = fileTransfer.offers;
    $scope.uploadedFiles = fileTransfer.myItems;
    
  }]);