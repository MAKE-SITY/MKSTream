angular.module('utils.linkGeneration', [])

.factory('linkGeneration', [function() {
  var linkGeneration = {};

  var s4 = function() {
    //this is a random hash generator
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  };

  linkGeneration.guid = function() {
    return adjAdjAnimal(); // global function from adjective-adjective-animal bower package, returns promise
  };

  linkGeneration.fuid = function() {
    return s4() + s4() + s4() + s4();
  };

  return linkGeneration;

}]);