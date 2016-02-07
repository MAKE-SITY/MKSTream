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

  notifications.connectionLost = function(){
    Notification.error({
      message: 'Connection Lost',
      positionX: notificationPosX
    });
  };

  notifications.tabReminder = function(){
    Notification.warning({
      message: 'If you place this tab in the background your connection will slow down. ' +
                'Please move this tab to a new window.',
      positionX: notificationPosX,
      delay: false
    });
  };

  notifications.alreadyUploaded = function(){
    Notification.error({
      message: 'You already uploaded that!',
      positionX: notificationPosX
    })
  };

  return notifications;

}]);