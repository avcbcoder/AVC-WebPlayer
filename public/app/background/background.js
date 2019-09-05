/*global chrome*/
import { EXT_COMM, VALID_REQ_TYPE } from "./constants.js";
import { fetchYoutubeVideos } from "./network/youtube-video-search/index.js";
import { fetchLyrics as getAzFandomLyrics } from "./network/lyrics-search/index.js";
import { fetchHappiLyrics } from "./network/happi/index.js";
import { cacheCheck } from "./storage.js";

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

chrome.runtime.onMessage.addListener(function(request) {
  if (!VALID_REQ_TYPE.includes(request.type)) return;
  switch (request.type) {
    case EXT_COMM.GET_LYRICS:
      fetchHappiLyrics();
      getAzFandomLyrics(request.data);
      break;
    case EXT_COMM.GET_VIDEO_ID:
      fetchYoutubeVideos(request.data);
      break;
    case EXT_COMM.SPOTIFY:
      break;
    case EXT_COMM.CHANGE_MEDIA:
      break;
  }
});

function handleSpotify(request) {
  const isSongChanged = request.type === "spotify";
  const storage = chrome.storage.local;

  if (request.method === "song-change") {
    cacheCheck(storage, function() {
      fetchHappiData(request.data, render);
    });
  }

  storage.get(["store"], result => {
    // modify song details and set default state for fetch
    const store = result.store;
    store[STORE_VAR.SONG] = request.data;
    store[STORE_VAR.LYRICS] = isSongChanged
      ? { state: "fetching", data: "" }
      : store[STORE_VAR.LYRICS];
    store[STORE_VAR.YOUTUBE] = isSongChanged
      ? { state: "fetching", data: "" }
      : store[STORE_VAR.YOUTUBE];
    store[STORE_VAR.HAPPI] = isSongChanged
      ? { state: "fetching", data: "" }
      : store[STORE_VAR.HAPPI];
    storage.set({ store: store }, () => {
      render();
    });
  });
}
