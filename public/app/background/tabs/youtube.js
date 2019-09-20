/*global chrome */
const startYoutubeMiniMode = videoId => {
  chrome.storage.local.get(["miniWindowId"], result => {
    const winId = result.miniWindowId;
    if (winId) chrome.windows.remove(winId);
    // create new window
    chrome.windows.create(
      {
        type: "popup",
        focused: true,
        width: 670,
        height: 470,
        url: `https://www.youtube.com/watch?v=${videoId}`
      },
      function(window) {
        const createdTab = window.tabs[0];
        chrome.tabs.executeScript(createdTab.id, {
          file: "app/background-script/youtube/index.js"
        });
        chrome.storage.local.set({ miniWindowTabId: createdTab.id });
        chrome.storage.local.set({ miniWindowId: window.id });
      }
    );
  });
  // chrome.storage.local.get(["miniWindowTabId"], result => {
  //   // remove previous window
  //   const tabId = result.miniWindowTabId;
  //   if (tabId) {
  //     chrome.tabs.executeScript(tabId, {
  //       code: "window.close();"
  //     });
  //     chrome.tabs.remove([tabId]);
  //   }
  // });
};

export default startYoutubeMiniMode;
