// console.log('goodbye');
document.addEventListener('DOMContentLoaded', function(){
		console.log('hello');
		chrome.runtime.onConnect.addListener(function(port) {
		  port.onMessage.addListener(function(msg) {
		  	console.log(msg);
		  });
		});

})