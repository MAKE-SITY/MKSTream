angular.module('connecting', [
  'utils'
])

.controller('connectingController', [
  '$scope',
  '$http',
  '$stateParams',
  '$rootScope',
  'fileTransfer',
  'webRTC',
  'packetHandlers',
  'fileUpload',
  'modals',
  function($scope, $http, $stateParams, $rootScope, fileTransfer, webRTC, packetHandlers, fileUpload, modals) {
    console.log('connecting controller loaded');
    /**
     * if arriving from redirect,
     * sender has access to their own peer object,
     * becasue it's on the fileTransfer
     *
     * if arriving from a link,
     * follow the code below:
     */
    var savedClasses = 'btn btn-circle lightningHover';

    $('#lightningBoltButton').mouseenter(function() {
      savedClasses = $('#lightningBoltButton').attr('class');
      $('#lightningBoltButton').attr('class', 'btn btn-circle lightningHover');
    });

    $('#lightningBoltButton').mouseleave(function() {
      $('#lightningBoltButton').attr('class', savedClasses)
      savedClasses = 'btn btn-circle lightningHover';
    });


    $scope.openModal = modals.openModal;
     
    $('#lightningBoltButton').on('click', function() {
      copyToClipboard(document.getElementById("currentUrl"));
      $('#lightningBoltButton').removeClass('glowing');
      if (!savedClasses.includes('connectedToPeer')) {
        if (window.location.href.includes('/room/')) {
          savedClasses = 'btn btn-circle lightningHover waitingForConnection';
        }
      }
    });

    $('.currentUrlShow').removeClass('currentUrlHidden');

    setTimeout(function() {
      currentUrl.innerHTML = window.location.href;

    }, 0);

    var copyToClipboard = function(elem) {
      // create hidden text element, if it doesn't already exist
      var targetId = "_hiddenCopyText_";
      var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
      var origSelectionStart, origSelectionEnd;
      if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
      } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
          var target = document.createElement("textarea");
          target.style.position = "absolute";
          target.style.left = "-9999px";
          target.style.top = "0";
          target.id = targetId;
          document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
      }
      // select the content
      var currentFocus = document.activeElement;
      target.focus();
      target.setSelectionRange(0, target.value.length);

      // copy the selection
      var succeed;
      try {
        succeed = document.execCommand("copy");
      } catch (e) {
        succeed = false;
      }
      // restore original focus
      if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
      }

      if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
      } else {
        // clear temporary content
        target.textContent = "";
      }
      return succeed;
    }

    var disconnectingReceiverId = null;

    $scope.incomingFileTransfers = fileTransfer.incomingFileTransfers;
    $scope.outgoingFileTransfers = fileTransfer.outgoingFileTransfers;
    $scope.acceptFileOffer = fileUpload.acceptFileOffer;
    $scope.rejectFileOffer = fileUpload.rejectFileOffer;
    $scope.offers = fileTransfer.offers;
    console.log('connecting scope', $scope.offers);

    if (!fileTransfer.peer) {
      fileTransfer.myItems = [];

      fileTransfer.conn = [];

      fileTransfer.peer = webRTC.createPeer();

      fileTransfer.peer.on('open', function(id) {
        disconnectingReceiverId = id;
        $http({
            method: 'POST',
            url: '/api/webrtc/users',
            data: {
              hash: $stateParams.roomHash,
              recipientId: id
            }
          })
          .then(function(res) {
            // expect res.data === sender id
            var conn = fileTransfer.peer.connect(res.data.senderID);
            fileTransfer.conn.push(conn);
            conn.on('data', function(data) {
              console.log('incoming packet');
              if (data.type === 'file-accepted') {
                packetHandlers.accepted(data, conn, $rootScope);
              } else if (data.type === 'file-offer') {
                packetHandlers.offer(data, conn, $rootScope);
              } else if (data.type === 'file-chunk') {
                packetHandlers.chunk(data, $rootScope);
              }
            });
          });
      });

      window.onbeforeunload = function(e) {
        //stops notification from showing
        e.preventDefault();
      };

      window.addEventListener('beforeunload', function() {
        $http({
          method: 'POST',
          url: '/api/webrtc/deleteReceiverId',
          data: {
            hash: $stateParams.roomHash,
            id: disconnectingReceiverId
          }
        });
      });

      document.getElementById('filesId').addEventListener('change', function() {
        console.log('connecting input listener');
        var files = this.files;
        for (var i = 0; i < files.length; i++) {
          if (fileTransfer.myItems.indexOf(files[i]) > -1) {
            continue;
          }
          files[i].beenSent = false;
          fileTransfer.myItems.push(files[i]);
        }
        fileTransfer.conn.forEach(function(connection) {
          webRTC.clearQueue(fileTransfer.myItems, connection);
        });
        //TODO: send files back

      });
    }

  }
]);
