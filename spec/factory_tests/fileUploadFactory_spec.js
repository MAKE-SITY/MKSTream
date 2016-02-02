describe('fileUpload Factory', function() {
  var fileUpload;
  beforeEach(function() {
    module('utils'); //angular.module name

    inject(function($injector) {
      fileUpload = $injector.get('fileUpload');
    });
  });

  describe('fileUpload', function() {
    describe('convertFileSize', function() {
      it('should return in GB for files larger than 1000000000 bytes', function() {
        var testGB = fileUpload.convertFileSize(438290423894);
        var result = testGB.substring(testGB.length - 2);
        expect(result).toBe('GB');
      });

      it('should return in MB for files larger than 1000000 bytes', function() {
        var testMB = fileUpload.convertFileSize(290423894);
        var result = testMB.substring(testMB.length - 2);
        expect(result).toBe('MB');
      });

      it('should return in kB for files less than 1000000 bytes', function() {
        var testkB = fileUpload.convertFileSize(423894);
        var result = testkB.substring(testkB.length - 2);
        expect(result).toBe('kB');
      });
    });

    describe('getTransferRate', function() {
      var transferInfo;

      beforeEach(function() {
        var transferObj = {
          nextTime: Date.now() - 1000,
          stored: 0,
          size: 100000,
          progress: 10000
        };
        transferInfo = fileUpload.getTransferRate(transferObj);
      });

      it('should return an object', function() {
        expect(transferInfo.constructor).toBe(Object);
      });

      it('should have transfer rate', function() {
        expect(transferInfo.rate).toBe('10.00 kB/s');
      });

      it('should have time remaining', function() {
        expect(transferInfo.time).toBe('00:09');
      });
    });
  });
});
