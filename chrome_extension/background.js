console.log('im the background page');

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name === "knockknock");
  port.onMessage.addListener(function(msg) {
  	console.log('fuck 1');
    if (msg.joke === "Knock knock") {
    	console.log('fuck 2');
      port.postMessage({question: "Who's there?"});
    } else if (msg.answer === "Madame") {
      console.log('fuck 3');
      port.postMessage({question: "Madame who?"});
    } else if (msg.answer === "Madame... Bovary") {
    	console.log('fuck 4');
      port.postMessage({question: "I don't get it."});
    }
  });
});