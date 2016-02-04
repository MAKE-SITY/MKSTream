angular.module('utils.modals', [])

.factory('modals', ['$uibModal', function($uibModal){

  var modals = {};

  modals.open = function(){
    $uibModal.open({
        animation: false,
        templateUrl: 'app/components/modals/modalView.html',
        controller: 'modalsController'
    });
    
  };

  return modals;

}])