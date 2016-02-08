console.log('im the background page');

chrome.browserAction.onClicked.addListener(function(activeTab){
  var newURL = "https://www.mkstream.club/#/";
  chrome.windows.create({ url: newURL });
});

