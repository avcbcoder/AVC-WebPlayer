import { STORE_VAR, CACHE_VAR, HAPPI_OBJ } from "../../constants.js";
import { LYRICS_HAPPI_API_KEYS } from "../../../../config.js";
import { render } from "../../sender.js";

const storage = chrome.storage.local;

function saveLyricsInStore(lyrics) {
  storage.get(["store"], result => {
    const store = result.store;
    const storeHappi = store[STORE_VAR.HAPPI];
    const happi = storeHappi["response"];
    happi[HAPPI_OBJ.LYRICS] = lyrics;
    storage.set({ store }, render);
  });
}

function saveLyricsInCache(id, lyrics) {
  storage.get(["cache"], result => {
    const cache = result.cache;
    const cacheHappi = cache[CACHE_VAR.HAPPI];
    const happi = cacheHappi[id];
    happi[HAPPI_OBJ.LYRICS] = lyrics;
    storage.set({ cache }, function() {});
  });
}

const fetchHappiLyrics = (songDetails) => {
  const { title, artist } = songDetails;
  const id = title + " " + artist.join(" "); //TODO: will change it to hash later

  storage.get(["cache"], result => {
    // search in the cache first
    const cache = result.cache;
    const cacheHappi = cache[CACHE_VAR.HAPPI];
    const happi = cacheHappi[id];

    if (happi && happi[HAPPI_OBJ.HAS_LYRICS] && happi[HAPPI_OBJ.LYRICS]) {
      // if exist in cache -> modify store
      saveInStore(happi);
    } else {
      const lyricsSearchUrl =
        happi[HAPPI_OBJ.API_LYRICS] + `?apikey=${LYRICS_HAPPI_API_KEYS[0]}`;
      $.get(lyricsSearchUrl, response => {
        if (!response || (response && response[HAPPI_OBJ.LENGTH] === 0)) {
          callback("");
          return;
        }
        const lyrics = response[HAPPI_OBJ.RESULT][HAPPI_OBJ.LYRICS];
        saveLyricsInStore(lyrics);
        saveLyricsInCache(id, lyrics);
      });
    }
  });
};

export { fetchHappiLyrics };
