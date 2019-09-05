/*global chrome*/
import { EXT_COMM, VALID_REQ_TYPE } from "./constants.js";
import { fetchYoutubeVideos } from "./network/youtube-video-search/index.js";
import {fetchLyrics} from './network/lyrics-search/index.js'
import { fetchHappiData, fetchHappiLyrics } from './network/happi/index.js'

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
      break;
    case EXT_COMM.GET_VIDEO_ID:
      break;
    case EXT_COMM.SPOTIFY:
      break;
    case EXT_COMM.CHANGE_MEDIA:
      break;
  }
});
