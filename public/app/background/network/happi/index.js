import { STORE_VAR, CACHE_VAR, HAPPI_OBJ } from "../../constants.js";
import { LYRICS_HAPPI_API_KEYS } from "../../../../config.js";

const storage = chrome.storage.local;

function fetch(searchString, callback) {
  const searchUrl = `https://api.happi.dev/v1/music?q=${searchString}&limit=1&apikey=${
    LYRICS_HAPPI_API_KEYS[0]
  }`;

  $.get(searchUrl, response => {
    if (!response || (response && response[HAPPI_OBJ.LENGTH] === 0)) {
      callback("");
      return;
    }
    const track = response[HAPPI_OBJ.RESULT][0];
    const happi = {
      cover: track[HAPPI_OBJ.COVER],
      apiLyrics: track[HAPPI_OBJ.API_LYRICS]
    };
    callback(happi);
  });
}

function saveInStore(data, render) {
  storage.get(["store"], result => {
    const store = result.store;
    store[STORE_VAR.HAPPI] = { state: "success", response: data };
    storage.set({ store }, render);
  });
}

function saveInCache(id, data) {
  storage.get(["cache"], result => {
    const cache = result.cache;
    const cacheHappi = cache[CACHE_VAR.HAPPI];
    cacheHappi[id] = data;
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
      // if exist in cache -> modify store
      saveInStore(happi, render);
    } else {
      // call api to fetch cover
      fetch(searchString, happiData => {
        saveInStore(happiData, render);
        saveInCache(id, happiData);
      });
    }
  });
};

export { fetchHappiData };
