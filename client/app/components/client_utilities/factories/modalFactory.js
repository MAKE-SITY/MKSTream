angular.module('utils.modals', [])

.factory('modals', ['$uibModal', function($uibModal){

  var modals = {};

  modals.openModal = function(template){
    var templateUrl;
    if(template === 'about'){
      templateUrl = 'app/components/modals/aboutModalView.html';
    } else if (template === 'guide') {
      templateUrl = 'app/components/modals/guideModalView.html';
    } else if (template === 'contact') {
      templateUrl = 'app/components/modals/contactModalView.html';
    }
    $uibModal.open({
        templateUrl: templateUrl,
        controller: 'modalsController',
        windowClass: 'informational-modal'
    });
    
  };

  return modals;

}]);