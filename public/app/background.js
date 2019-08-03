// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(function (tab) {
   // Send a message to the active tab
   chrome.tabs.query({}, function (tabs) {
      for (let i = 0; i < tabs.length; i++) {
         var activeTab = tabs[i];
         chrome.tabs.sendMessage(activeTab.id, { "message": "clicked_browser_action" });
      }
   });
});

// recieve msg from foreground and send to one or all tabs
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.type === "notification") {
      chrome.tabs.query({}, function (tabs) {
         for (let i = 0; i < tabs.length; i++) {
            var activeTab = tabs[i];
            chrome.tabs.sendMessage(activeTab.id, { "message": "console" });
         }
      });
   }
   sendResponse()
});