import { STORE_VAR, CACHE_VAR } from "../../constants.js";
import { LYRICS_HAPPI_API_KEYS } from "../../../../config.js";

const storage = chrome.storage.local;

function fetch(searchString, callback) {
  const searchUrl = `https://api.happi.dev/v1/music?q=${searchString}&limit=3&apikey=${
    LYRICS_HAPPI_API_KEYS[0]
  }`;

  $.get(searchUrl, data => {
    chrome.extension.getBackgroundPage().console.log("AFTER FETCH", data);
    callback(data);
  });
}

function saveInStore( data, render) {
  storage.get(["store"], result => {
    const store = result.store;
    store[STORE_VAR.YOUTUBE] = { state: "success", data };
    storage.set({ store: store }, function() {
      render();
    });
  });
}

function saveInCache(id, data) {
  storage.get(["cache"], result => {
    const cache = result.cache;
    const cacheVideos = cache[CACHE_VAR.VIDEO];
    cacheVideos[id] = data;
    storage.set({ cache }, function() {});
  });
}

const fetchHappiData = (songDetails, render) => {
  const { title, artist } = songDetails;
  const searchString = title + " " + artist.join(" ");
  const id = searchString; // will change it to hash later

  storage.get(["cache"], result => {
    // search in the cache first
    const cache = result.cache;
    const cacheHappi = cache[CACHE_VAR.HAPPI];
    const happi = cacheHappi[id];

    if (happi) {
      saveInStore(happi, render);
    } else {
      fetch(searchString, data => {
        saveInStore(data, render);
        saveInCache(id, data);
      });
    }
  });
};

export { fetchHappiData };
