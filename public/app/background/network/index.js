/*global chrome*/

import {STORE_VAR, CACHE_VAR} from '../constants.js'
import {fetchLyrics} from './lyrics-search/index.js'

function cacheCheck(storage, callback) {
  storage.get(["cache"], result => {
    // wheteher cache is initialised or not
    const cache = result.cache;
    if (cache) {
      callback();
    } else {
      const defaultCache = { cache_video: {}, cache_lyrics: {} };
      storage.set({ cache:defaultCache }, callback);
    }
  });
}

const render = () => {
  chrome.tabs.query({}, function(tabs) {
    // DO NOT SEND TO ALL TABS
    for (let i = 0; i < tabs.length; i++) {
      chrome.tabs.sendMessage(tabs[i].id, {
        type: "store-modified"
      });
    }
  });
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type !== "spotify") return;

  const isSongChanged = request.type === "spotify";
  const storage = chrome.storage.local;

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
    storage.set({ store: store }, () => {
      render();
    });
  });

  if (request.method === "song-change") {
    cacheCheck(storage,function(){
      fetchLyrics(storage, request.data,render);
      fetchYoutubeVideos(storage, request.data,render);
    })
  }
});
