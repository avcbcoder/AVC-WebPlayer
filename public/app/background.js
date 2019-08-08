/*global chrome*/

// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(function (tab) {
   // Send a message to the active tab
   chrome.runtime.sendMessage("emklekamjcedidleoebpbpcejnjpbmdk", { min: 'fjdnjdn' });
   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      for (let i = 0; i < tabs.length; i++) {
         var activeTab = tabs[i];
         chrome.tabs.sendMessage(activeTab.id, { "message": "clicked_browser_action", "tabs": tabs });
      }
   });
   // chrome.windows.create({ type: "panel", focused: true, width: 470, height: 440, url: "https://www.youtube.com/watch?v=dfnCAmr569k" });
   // var myWindow = window.open("./window.html", "newWindow", "width=500,height=700");
   // chrome.app.window.create('window.html', {
   //    alwaysOnTop: true,
   //    'outerBounds': {
   //       'width': 560,
   //       'height': 315
   //    }
   // });
   // to launch own chrome app
   // chrome.management.launchApp("emklekamjcedidleoebpbpcejnjpbmdk", function () {
   //    console.log('lets see')
   // })
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

