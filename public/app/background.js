/*global chrome*/

// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(function (tab) {
   // Send a message to the active tab
   // chrome.runtime.sendMessage("emklekamjcedidleoebpbpcejnjpbmdk", { min: 'fjdnjdn' });
   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      for (let i = 0; i < tabs.length; i++) {
         var activeTab = tabs[i];
         if (!(activeTab.url.includes('chrome://') || activeTab.url.includes('chrome-search://'))) {
            chrome.tabs.sendMessage(activeTab.id, { "message": "clicked_browser_action", "tabs": tabs });
         }
      }
   });

   // chrome.windows.create({ type: "panel", focused: false, width: 470, height: 440, url: "https://www.youtube.com/watch?v=dfnCAmr569k" });

});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.type === "toggle") {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         for (let i = 0; i < tabs.length; i++) {
            var activeTab = tabs[i];
            chrome.tabs.sendMessage(activeTab.id, { "message": "clicked_browser_action", "tabs": tabs });
         }
      });
   }
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
   if (request.type === "extract-spotify-data") {
      chrome.tabs.query({}, function (tabs) {
         for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];
            if (tab.url.includes('//open.spotify.com')) {
               chrome.tabs.executeScript(tab.id, { file: "app/spotify-script.js" })
            }
         }
      });
   }
});

const executeMediaButton = (id, media) => {
   chrome.tabs.executeScript(id, { code: `${media}.click()` });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.type === "media") {
      chrome.tabs.query({}, function (tabs) {
         for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];
            if (tab.url.includes('//open.spotify.com')) {
               chrome.tabs.executeScript(tab.id, { file: "app/page-elements.js" },
                  executeMediaButton(tab.id, request.options.type))
            }
         }
      });
   }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.type === "current-song-details") {
      chrome.tabs.query({}, function (tabs) {
         for (let i = 0; i < tabs.length; i++) {
            var activeTab = tabs[i];
            chrome.tabs.sendMessage(activeTab.id, { "message": "current-song-details", "songDetailsObj": request.options.songDetailsObj });
         }
      });
   }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.type === "mini-mode") {
      chrome.tabs.create({ url: request.options.url, active: false, index: 0 }, function (tab) {
         // chrome.tabs.executeScript(tab.id, { file: "app/youtube-script.js" })
      });
   }
   if (request.type === "start-mini-mode") {
      chrome.tabs.query({}, function (tabs) {
         for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];
            if (tab.url.includes('//www.youtube.com')) {
               chrome.tabs.executeScript(tab.id, { file: "app/youtube-script.js" })
            }
         }
      });
   }
});

chrome.tabs.onCreated.addListener(function (tab) {
   // console.log("here is tab", tab);
   // execute scripts from here only
   // chrome.tabs.executeScript(tab.id, { code: "alert('Hello World')" });
   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.storage.local.set({ 'url': tabs[0].url }, function () { });
   })
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
   // execute content scripts from here only
   // chrome.tabs.executeScript(tabId, { code: "alert('Hello World')" });
   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.storage.local.set({ 'url': tabs[0].url }, function () { });
   })
});
