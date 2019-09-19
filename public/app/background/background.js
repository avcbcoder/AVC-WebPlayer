/*global chrome*/
import { EXT_COMM, VALID_REQ_TYPE, STORE_VAR, API_STATE } from "./constants.js";
import { fetchYoutubeVideos } from "./network/youtube-video-search/index.js";
import { fetchLyrics as getAzFandomLyrics } from "./network/lyrics-search/index.js";
import { fetchHappiData, fetchHappiLyrics } from "./network/happi/index.js";
import { fetchAlphaImages } from "./network/alpha-image-search/index.js";
import { cacheCheck } from "./storage.js";
import { render } from "./sender.js";
import startYoutubeMiniMode from "./tabs/youtube.js";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.extension.getBackgroundPage().console.log("RECIEVED REQ", request);
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

// CALLED WHENEVER BUTTON IS CLICKED FROM APP
function injectChangeMedia(request) {
  chrome.tabs.query({}, tabs => {
    tabs.forEach(tab => {
      if (!tab.url.includes("//open.spotify.com")) return;
      chrome.tabs.executeScript(
        tab.id,
        { file: "app/background-script/spotify-buttons.js" },
        () => {
          chrome.tabs.executeScript(tab.id, {
            code: `if(${request.button})${request.button}.click();`
          });
        }
      );
    });
  });
}

// CALLED WHENEVER SONG DETAILS CHANGE
function handleSpotify(request) {
  const isSongChanged = request.method === "song-change";
  const storage = chrome.storage.local;

  if (isSongChanged)
    cacheCheck(function() {
      fetchHappiData(request.data);
      fetchAlphaImages(request.data);
    });

  storage.get(["store"], result => {
    const store = result.store;
    store[STORE_VAR.SONG] = request.data;
    store[STORE_VAR.LYRICS] = isSongChanged
      ? { state: API_STATE.IDLE, response: "" }
      : store[STORE_VAR.LYRICS];
    store[STORE_VAR.YOUTUBE] = isSongChanged
      ? { state: API_STATE.IDLE, response: "" }
      : store[STORE_VAR.YOUTUBE];
    store[STORE_VAR.HAPPI] = isSongChanged
      ? { state: API_STATE.IDLE, response: "" }
      : store[STORE_VAR.HAPPI];
    store[STORE_VAR.ALPHA] = isSongChanged
      ? { state: API_STATE.IDLE, response: "" }
      : store[STORE_VAR.ALPHA];
    storage.set({ store: store }, () => {
      render(request);
    });
  });
}

// LISTENERS -----
chrome.runtime.onMessage.addListener(function(request) {
  if (!VALID_REQ_TYPE.includes(request.type)) return;
  switch (request.type) {
    case EXT_COMM.GET_HAPPI_DATA:
      fetchHappiData(request.data);
      break;
    case EXT_COMM.GET_LYRICS:
      fetchHappiLyrics(request.data);
      getAzFandomLyrics(request.data);
      break;
    case EXT_COMM.GET_VIDEO_ID:
      fetchYoutubeVideos(request.data);
      break;
    case EXT_COMM.SPOTIFY:
      handleSpotify(request);
      break;
    case EXT_COMM.CHANGE_MEDIA:
      injectChangeMedia(request);
      break;
    case EXT_COMM.YOUTUBE_MINI_MODE:
      if (request && request.videoId) startYoutubeMiniMode(request.videoId);
      break;
  }
});

const isLocalUrl = url => {
  return (
    url &&
    (url.includes("chrome://") ||
      url.includes("chrome-search://") ||
      url.includes("chrome-extension://") ||
      url.includes("chrome-error://chromewebdata/"))
  );
};

// listeners for tab
chrome.tabs.onCreated.addListener(tab => {
  if (!isLocalUrl(tab.url))
    setTimeout(() => {
      chrome.storage.local.get(["miniWindow"], result => {
        if (tab && tab.id !== result.miniWindow) {
          chrome.tabs.executeScript(tab.id, {
            file: "content-script/pip-for-videos.js"
          });
        }
      });
    }, 1500);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status == "complete" &&
    tab.status == "complete" &&
    tab.url !== undefined &&
    !isLocalUrl(tab.url)
  )
    setTimeout(() => {
      chrome.storage.local.get(["miniWindow"], result => {
        if (tabId !== result.miniWindow) {
          chrome.tabs.executeScript(tabId, {
            file: "content-script/pip-for-videos.js"
          });
        }
      });
    }, 500);
});
