console.log('im the background page');

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name === "knockknock");
  port.onMessage.addListener(function(msg) {
  	console.log('hello 1');
    if (msg.joke === "Knock knock") {
    	console.log('hello 2');
      port.postMessage({question: "Who's there?"});
    } else if (msg.answer === "Madame") {
      console.log('hello 3');
      port.postMessage({question: "Madame who?"});
    } else if (msg.answer === "Madame... Bovary") {
    	console.log('hello 4');
      port.postMessage({question: "I don't get it."});
    }
  });
});