
// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(function (tab) {
   // Send a message to the active tab
   chrome.tabs.query({}, function (tabs) {
      for (let i = 0; i < tabs.length; i++) {
         var activeTab = tabs[i];
         chrome.tabs.sendMessage(activeTab.id, { "message": "clicked_browser_action" });
      }
   });
   // chrome.tabs.executeScript(null, { code: `document.body.style.background = 'red';console.log('done');` });
   // chrome.tabs.executeScript(null, { file: 'app/ss.js' });
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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.type === "change-bkg") {
      chrome.tabs.query({}, function (tabs) {
         for (let i = 0; i < tabs.length; i++)
            chrome.tabs.executeScript(tabs[i].id, { code: "document.body.style.background='red';console.log('done')" })
      });
   }
});

