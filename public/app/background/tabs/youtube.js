/*global chrome */
import { fetchYoutubeVideos } from "../network/youtube-video-search/index.js";

const startYoutubeMiniMode = (songDetails, videoId) => {
  if (videoId) {
    // create new window if videoId available
    createWindow(videoId);
  } else {
    // fetch video Id for this song and the create window
    fetchYoutubeVideos(songDetails, videos => {
      if (videos && videos.length > 0) createWindow(videos[0].videoId);
    });
  }
};

const createWindow = videoId => {
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
      // remove previously created windows
      removeWindow(() => {
        chrome.storage.local.set({ miniWindowTabId: createdTab.id });
        chrome.storage.local.set({ miniWindowId: window.id });
      });
    }
  );
};

const removeWindow = callback => {
  chrome.storage.local.get(["miniWindowId"], result => {
    const winId = result.miniWindowId;
    if (winId) chrome.windows.remove(winId);
    if (callback) callback();
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
