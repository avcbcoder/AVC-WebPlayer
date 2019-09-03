/*global chrome*/

import {STORE_VAR, CACHE_VAR} from '../constants.js'

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

const fetchYoutubeVideos = (storage, songDetails) => {
  const { title, artist } = songDetails;
  const searchString = title + " " + artist.join(" ");
  const id = searchString; // will change it to hash later

  function fetch(searchURL, callback) {
    chrome.extension.getBackgroundPage().console.log("searching in youtube");
    $.get(
      searchURL,
      {
        part: "snippet",
        q: searchString,
        type: "video",
        key: "AIzaSyD91jOqElBJNXKvCFIfXd_VzyOXXiJuAZQ",
        maxResults: "3"
      },
      data => {
        chrome.extension.getBackgroundPage().console.log("data found", data);
        callback(data);
      }
    );
  }

  cacheCheck(storage,(cc)=>{
    chrome.extension.getBackgroundPage().console.log("returned by cache check", cc);
    storage.get(["cache"], result => {
        // search in the cache first
        const cache = result.cache;
        const cacheVideos = cache[CACHE_VAR.VIDEO];
        const video = cacheVideos[id];
    
        function save(data) {
          storage.get(["store"], result => {
            // save in store
            const store = result.store;
            store[STORE_VAR.YOUTUBE] = { state: "success", data };
            storage.set({ store: store }, function() {
              render();
            });
          });
        }
    
        if (video) {
          chrome.extension
            .getBackgroundPage()
            .console.log("data found in cache", data);
          save(video);
        } else {
          const searchURL = `https://www.googleapis.com/youtube/v3/search`;
          fetch(searchURL, data => {
            chrome.extension
            .getBackgroundPage()
            .console.log("data fetch from yt api", data);
            save(data);
            storage.get(["cache"], result => {
              // save in cache
              const cache = result.cache;
              cacheVideos = cache[CACHE_VAR.VIDEO];
              cacheVideos[id] = data;
              storage.set({ cache }, function() {});
            });
          });
        }
      });
  })
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
    fetchLyrics(storage, request.data);
    fetchYoutubeVideos(storage, request.data);
  }
});
