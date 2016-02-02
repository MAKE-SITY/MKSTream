describe('webRTC Factory', function() {
  var webRTC;
  beforeEach(function() {
    module('utils'); //angular.module name
    inject(function($injector) {
      webRTC = $injector.get('webRTC');
    });
  });

  describe('webRTC', function() {
    describe('createPeer', function() {
      it('should return a peer object', function() {
        webRTC.heartBeat = function() {
          // fake heartbeat
        };
        var peer = webRTC.createPeer();
        expect(peer.constructor).toBe(Peer);
      });
    });

    describe('clearQueue', function() {
      var conn;
      beforeEach(function() {
        conn = {
          send: function() {
            // fake send
          }
        };
        spyOn(conn, 'send');
      });

      it('should call conn.send', function() {
        webRTC.clearQueue([{}], conn);
        expect(conn.send).toHaveBeenCalled();
      });
    });
  });
});
