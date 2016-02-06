angular.module('utils.notifications', [
  'ui-notification'
])

.factory('notifications', ['Notification', function(Notification){

  var notifications = {};

  var notificationPosX = 'center';

  notifications.successMessage = function(name){
    Notification.success({
      message: name + ' finished downloading',
      positionX: notificationPosX
    });
  };

  notifications.connectionLost = function(name){
    Notification.error({
      message: 'Connection Lost',
      positionX: notificationPosX
    });
  };

  return notifications;

}]);