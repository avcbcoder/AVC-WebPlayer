/*global chrome */
const startYoutubeMiniMode = videoId => {
  chrome.storage.local.get(["miniWindowId"], result => {
    // remove previously created windows
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
};

const minimizeWindow = () => {
  chrome.storage.local.get(["miniWindowId"], result => {
    // minimize this window
    const winId = result.miniWindowId;
    if (winId) chrome.windows.update(winId, { state: "minimized" });
  });
};

export { startYoutubeMiniMode, minimizeWindow };
