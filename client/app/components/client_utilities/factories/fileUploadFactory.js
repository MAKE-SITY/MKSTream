angular.module('utils.fileUpload', ['utils.fileReader'])

.factory('fileUpload', ['fileReader', 'fileTransfer', 'webRTC', function(fileReader, fileTransfer, webRTC) {
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

  fileUploadObj.convertFileSize = function(num) {
    if (num > 1000000000) {
      return (num / 1000000000).toFixed(2) + ' GB';
    } else if (num > 1000000) {
      return (num / 1000000).toFixed(2) + ' MB';
    } else {
      return (num / 1000).toFixed(2) + ' kB';
    }
  };

  fileUploadObj.acceptFileOffer = function(offer) {
    fileTransfer.downloadQueue.push(offer);
    var index = fileTransfer.offers.indexOf(offer);
    fileTransfer.offers.splice(index, 1);
    webRTC.checkDownloadQueue();
  };

  fileUploadObj.rejectFileOffer = function(offer) {
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
    var sec_num = parseInt(timeInSeconds, 10); // don't forget the second param
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

  fileUploadObj.getTransferRate = function(transferObj) {
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
      console.log('RATE:', convertRate(rate));
      console.log('TIME REMAINING:', convertTime(timeRemaining));
    }
  };

  return fileUploadObj;

}]);
