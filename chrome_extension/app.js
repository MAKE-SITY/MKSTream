angular.module('mkExtension', [])
.controller('main', ['$scope', function($scope){
	$scope.message = 'click and upload a file';
	var port = chrome.runtime.connect({name: "knockknock"});
	port.postMessage({joke: "Knock knock"});
	
	port.onMessage.addListener(function(msg) {
	  console.log("receiving Who\'s there?"); 
	  if (msg.question == "Who's there?") {
	    console.log("sending Madame"); 
	    port.postMessage({answer: "Madame"});
	  } else if (msg.question == "Madame who?") {
	  	  console.log("sending Madame... Bovary"); 
	    port.postMessage({answer: "Madame... Bovary"});
	  }
	});



}]);