angular.module('utils.fileUpload', ['utils.fileReader'])

.factory('fileUpload', [
  'fileReader', 
  'fileTransfer', 
  'webRTC', 
  'linkGeneration',
  'Notification', 
  'modals',
  function(fileReader, fileTransfer, webRTC, linkGeneration, Notification, modals) {
  var fileUpload = {};

  fileUpload.getFiles = function() {
    return document.getElementById('filesId').files;
  };

  fileUpload.convertFromBinary = function(data) {
    var kit = {};
    kit.href = URL.createObjectURL(data.file);
    kit.name = data.name;
    kit.size = data.size;
    return kit;
  };

  fileUpload.convertFileSize = function(num) {
    if (num > 1000000000) {
      return (num / 1000000000).toFixed(2) + ' GB';
    } else if (num > 1000000) {
      return (num / 1000000).toFixed(2) + ' MB';
    } else {
      return (num / 1000).toFixed(2) + ' kB';
    }
  };

  fileUpload.acceptFileOffer = function(offer) {
    offer.fileKey = linkGeneration.generateHash();
    fileTransfer.incomingFileTransfers[offer.fileKey] = {
      name: offer.name,
      size: offer.size,
      formattedSize: fileUpload.convertFileSize(offer.rawSize),
      progress: 0
    };
    fileTransfer.downloadQueue.push(offer);
    var index = fileTransfer.offers.indexOf(offer);
    fileTransfer.offers.splice(index, 1);
    webRTC.checkDownloadQueue();
  };

  fileUpload.rejectFileOffer = function(offer) {
    var index = fileTransfer.offers.indexOf(offer);
    fileTransfer.offers.splice(index, 1);
  };


  var convertRate = function(rate) {
    // expects kB/s
    if (rate > 1000) {
      return (rate / 1000).toFixed(2).toString() + ' MB/s';
    } else {
      return rate.toFixed(2).toString() + ' kB/s';
    }
  };

  var convertTime = function(timeInSeconds) {
    // expects seconds
    var sec_num = parseInt(timeInSeconds, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    var time = minutes + ':' + seconds;
    if (hours > 0) {
      time = hours + ':' + time;
    }
    return time;
  };

  fileUpload.getTransferRate = function(transferObj) {
    // takes the incoming transferObj which is expected to have certain properties
    var currentTime = Date.now();
    var timeToWait = 1000; // ms
    if (currentTime >= transferObj.nextTime) {
      transferObj.nextTime = Date.now() + timeToWait;
      var pastBytes = transferObj.stored;
      transferObj.stored = transferObj.progress;
      var rate = ((transferObj.stored - pastBytes)) / (timeToWait); // B/ms (kB/s)
      var maxFileSize = transferObj.size;
      timeRemaining = (maxFileSize - transferObj.stored) / rate / 1000; // ms/1000 -> s
      // console.log('CURRENT BYTES', transferObj.stored);
      // console.log('PASTCOUNT', pastBytes);
      // console.log('DIFFERENCE', transferObj.stored - pastBytes);
      // console.log('maxFileSize', maxFileSize);
      // console.log('REMAINING BYTES', maxFileSize - transferObj.stored);

      convertedRate = convertRate(rate);
      convertedTime = convertTime(timeRemaining);
      // console.log('RATE:', convertedRate);
      // console.log('TIME REMAINING:', convertedTime);

    }


    return {
      rate: convertedRate,
      time: convertedTime
    };
  };

  fileUpload.receiveFiles = function(){
    var files = this.files;
    for (var i = 0; i < files.length; i++) {
      if (fileTransfer.myItems.indexOf(files[i]) > -1) {
        continue;
      }
      files[i].beenSent = false;
      files[i].formattedSize = fileUpload.convertFileSize(files[i].size);
      fileTransfer.myItems.push(files[i]);
    }
    fileTransfer.conn.forEach(function(connection) {
      webRTC.clearQueue(fileTransfer.myItems, connection);
    });
  };

  fileUpload.checkBrowser = function(){
    var goodBrowser = util.browser !== 'Unsupported';
    var supportsDataChannel = util.supports.data;
    if(!goodBrowser || !supportsDataChannel){
      modals.badBrowser();
    }
  };

  return fileUpload;

}]);
