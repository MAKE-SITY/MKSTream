angular.module('download', [
  'utils',
  'ngAnimate'
])

.controller('downloadController', [
  '$scope',
  '$http',
  '$stateParams',
  '$rootScope',
  'fileTransfer',
  'webRTC',
  'packetHandlers',
  'fileUpload',
  function($scope, $http, $stateParams, $rootScope, fileTransfer, webRTC, packetHandlers, fileUpload) {
    console.log('download controller loaded');

    $scope.incomingFileTransfers = fileTransfer.incomingFileTransfers;
    $scope.outgoingFileTransfers = fileTransfer.outgoingFileTransfers;
    $scope.acceptFileOffer = fileUpload.acceptFileOffer;
    $scope.rejectFileOffer = fileUpload.rejectFileOffer;
    $scope.offers = fileTransfer.offers;
    console.log('download scope', $scope.offers);




  }
]);
