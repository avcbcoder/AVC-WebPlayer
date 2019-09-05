/*global chrome*/

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "toggle") {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      for (let i = 0; i < tabs.length; i++) {
        var activeTab = tabs[i];
        chrome.tabs.sendMessage(activeTab.id, {
          message: "clicked_browser_action",
          tabs: tabs
        });
      }
    });
    chrome.tabs.query({}, tabs => {
      tabs.forEach(tab => {
        if (tab.url.includes("//open.spotify.com")) {
          chrome.tabs.executeScript(tab.id, {
            file: "app/background-script/spotify-script.js"
          });
        }
      });
    });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "change-media") {
    
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "change-media") {
    chrome.tabs.query({}, tabs => {
      tabs.forEach(tab => {
        if (!tab.url.includes("//open.spotify.com")) return;
        chrome.tabs.executeScript(
          tab.id,
          { file: "app/background-script/spotify-buttons.js" },
          () => {
            chrome.tabs.executeScript(
              tab.id,
              {
                code: `console.log(${request.button});if(${request.button})${request.button}.click();`
              },
              () => {}
            );
          }
        );
      });
    });
  }
});

chrome.tabs.onCreated.addListener(function(tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs && tabs.length > 0)
      chrome.storage.local.set({ url: tabs[0].url }, function() {});
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs && tabs.length > 0)
      chrome.storage.local.set({ url: tabs[0].url }, function() {});
  });
});
