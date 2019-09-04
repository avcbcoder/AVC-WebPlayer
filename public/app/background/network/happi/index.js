import { STORE_VAR, CACHE_VAR, HAPPI_OBJ } from "../../constants.js";
import { LYRICS_HAPPI_API_KEYS } from "../../../../config.js";
import { fetchHappiLyrics } from "./lyrics-search.js";

const storage = chrome.storage.local;

const filter = (str, space) => {
  let track = [];
  for (let i = 0; i < str.length; i++)
    if (str[i] === "(") break;
    else if (str[i] === " ") track.push(space ? space : " ");
    else
      track.push(
        (str[i] >= "a" && str[i] <= "z") || (str[i] >= "0" && str[i] <= "9")
          ? str[i]
          : ""
      );
  return track.join("");
};

function fetch(searchString, callback) {
  const searchUrl = `https://api.happi.dev/v1/music?q=${searchString}&limit=1&apikey=${
    LYRICS_HAPPI_API_KEYS[0]
  }`;

  $.get(searchUrl, response => {
    chrome.extension
      .getBackgroundPage()
      .console.log("happi search response ", searchUrl, response);
    if (!response || (response && response[HAPPI_OBJ.LENGTH] === 0)) {
      callback("");
      return;
    }
    const track = response[HAPPI_OBJ.RESULT][0];
    const happi = {};
    happi[HAPPI_OBJ.COVER] = track[HAPPI_OBJ.COVER];
    happi[HAPPI_OBJ.API_LYRICS] = track[HAPPI_OBJ.API_LYRICS];
    happi[HAPPI_OBJ.HAS_LYRICS] = track[HAPPI_OBJ.HAS_LYRICS];
    happi[HAPPI_OBJ.TRACK] = track[HAPPI_OBJ.TRACK];

    callback(happi);
  });
}

function saveInStore(data, render) {
  storage.get(["store"], result => {
    const store = result.store;
    store[STORE_VAR.HAPPI] = { state: data?"success":"fail", response: data };
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
  const searchString = filter(title.toLowerCase(), " ") + " " + filter(artist[0].toLowerCase(), " ");
  const id = title + " " + artist.join(" "); //TODO: will change it to hash later

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
        if (happiData[HAPPI_OBJ.HAS_LYRICS])
          fetchHappiLyrics(
            songDetails,
            happiData[HAPPI_OBJ.API_LYRICS],
            render
          );
      });
    }
  });
};

export { fetchHappiData };
