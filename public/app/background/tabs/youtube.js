/*global chrome */
const startYoutubeMiniMode = videoId => {
  chrome.windows.create(
    {
      type: "popup",
      focused: true,
      width: 670,
      height: 470,
      url: `https://www.youtube.com/watch?v=${videoId}`
    },
    function(window) {
      chrome.extension
        .getBackgroundPage()
        .console.log("created window", window);
      const createdTab = window.tabs[0];
      chrome.tabs.executeScript(createdTab.id, {
        file: "app/background-script/youtube/index.js"
      });
    }
  );
};

export default startYoutubeMiniMode;
