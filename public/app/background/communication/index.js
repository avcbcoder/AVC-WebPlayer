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
    chrome.tabs.query({}, function(tabs) {
      for (let i = 0; i < tabs.length; i++)
        if (tabs[i].url.includes("//open.spotify.com")) {
          chrome.tabs.executeScript(tabs[i].id, {
            file: "app/background-script/spotify.js"
          });
        }
    });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "media") {
    chrome.tabs.query({}, function(tabs) {
      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i];
        if (tab.url.includes("//open.spotify.com")) {
          chrome.tabs.executeScript(tab.id, {
            code: `spotifyPageElements.${request.options.type}.click()`
          });
        }
      }
    });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "mini-mode") {
    chrome.tabs.create(
      { url: request.options.url, active: false, index: 0 },
      function(tab) {
        // chrome.tabs.executeScript(tab.id, { file: "app/youtube-script.js" })
      }
    );
  }
  if (request.type === "start-mini-mode") {
    chrome.tabs.query({}, function(tabs) {
      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i];
        if (tab.url.includes("//www.youtube.com")) {
          chrome.tabs.executeScript(tab.id, { file: "app/youtube-script.js" });
        }
      }
    });
  }
});

chrome.tabs.onCreated.addListener(function(tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.extension.getBackgroundPage().console.log("tab created");
    chrome.storage.local.set({ url: tabs[0].url }, function() {});
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.storage.local.set({ url: tabs[0].url }, function() {});
  });
});
