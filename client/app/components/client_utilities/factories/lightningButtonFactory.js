angular.module('utils.lightningButton', [])

.factory('lightningButton', ['linkGeneration', function(linkGeneration){
  var lightningButton = {};

  lightningButton.activateLightningButton = function(){
    var savedClasses = 'btn btn-circle lightningHover';

    $('#lightningBoltButton').mouseenter(function() {
      savedClasses = $('#lightningBoltButton').attr('class');
      $('#lightningBoltButton').attr('class', 'btn btn-circle lightningHover');
    });

    $('#lightningBoltButton').mouseleave(function() {
      $('#lightningBoltButton').attr('class', savedClasses);
      savedClasses = 'btn btn-circle lightningHover';
    });

    $('#lightningBoltButton').mousedown(function() {
      $('#lightningBoltButton').addClass('clicked');
    });

    $('#lightningBoltButton').mouseup(function() {
      $('#lightningBoltButton').removeClass('clicked');
    });

  };

  lightningButton.addLinkToLightningButton = function(){
    $('#lightningBoltButton').on('click', function() {
      linkGeneration.copyToClipboard(document.getElementById("currentUrl"));
      if (!savedClasses.includes('connectedToPeer')) {
        if (window.location.href.includes('/room/')) {
          savedClasses = 'btn btn-circle lightningHover waitingForConnection';
        }
      }
    });
  };

  lightningButton.connectedToPeer = function(){
    $('#lightningBoltButton').removeClass('waitingForConnection');
    $('#lightningBoltButton').addClass('connectedToPeer');
    $('.currentConnectionState').text('Connected!');
  };

  lightningButton.disconnected = function(){
    $('#lightningBoltButton').removeClass('connectedToPeer');
    $('#lightningBoltButton').addClass('disconnected');
    $('.currentConnectionState').text('Disconnected');
  };

  lightningButton.awaitingConnection = function(){
     $('#lightningBoltButton').addClass('waitingForConnection');
     $('.currentConnectionState').text('Awaiting Connection...');
  };

  return lightningButton;
}]);