angular.module('utils.notifications', [
  'ui-notification'
])

.factory('notifications', ['Notification', function(Notification){

  var notifications = {};

  notifications.successMessage = function(name){
    Notification.success({
      message: name + ' finished downloading',
      positionX: 'center'
    });
  };

  notifications.connectionLost = function(name){
    Notification.error({
      message: 'Connection Lost',
      positionX: 'center'
    });
  };

  return notifications;

}])