import { STORE_VAR,CACHE_VAR, YOUTUBE_V3_SEARCH } from "../../constants.js";

function fetch(searchString, callback) {
  chrome.extension.getBackgroundPage().console.log("searching in youtube");
  $.get(
    YOUTUBE_V3_SEARCH,
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

function saveInStore(storage,data, render) {
  storage.get(["store"], result => {
    const store = result.store;
    store[STORE_VAR.YOUTUBE] = { state: "success", data };
    storage.set({ store: store }, function() {
      render();
    });
  });
}

function saveInCache(storage,id, data) {
  storage.get(["cache"], result => {
    const cache = result.cache;
    const cacheVideos = cache[CACHE_VAR.VIDEO];
    cacheVideos[id] = data;
    storage.set({ cache }, function() {});
  });
}

const fetchYoutubeVideos = (storage, songDetails, render) => {
  const { title, artist } = songDetails;
  const searchString = title + " " + artist.join(" ");
  const id = searchString; // will change it to hash later

  storage.get(["cache"], result => {
    // search in the cache first
    const cache = result.cache;
    const cacheVideos = cache[CACHE_VAR.VIDEO];
    const video = cacheVideos[id];

    if (video) {
      chrome.extension
        .getBackgroundPage()
        .console.log("data found in cache", data);
      saveInStore(storage,video, render);
    } else {
      fetch(searchString, data => {
        chrome.extension
          .getBackgroundPage()
          .console.log("data fetch from yt api", data);
        saveInStore(storage,data, render);
        saveInCache(storage,id, data);
      });
    }
  });
};

export { fetchYoutubeVideos };