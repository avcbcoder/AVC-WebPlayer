import { STORE_VAR, CACHE_VAR, HAPPI_OBJ } from "../../constants.js";
import { LYRICS_HAPPI_API_KEYS } from "../../../../config.js";

const storage = chrome.storage.local;

function saveLyricsInStore(lyrics, render) {
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

const fetchHappiLyrics = (songDetails, lyricsSearchUrl, render) => {
  const { title, artist } = songDetails;
  const id = title + " " + artist.join(" "); //TODO: will change it to hash later

  lyricsSearchUrl = lyricsSearchUrl + `?apikey=${LYRICS_HAPPI_API_KEYS[0]}`;
  $.get(lyricsSearchUrl, response => {
    chrome.extension.getBackgroundPage().console.log('lyrics search response ', response);
    if (!response || (response && response[HAPPI_OBJ.LENGTH] === 0)) {
      callback("");
      return;
    }
    const lyrics = response[HAPPI_OBJ.RESULT][HAPPI_OBJ.LYRICS];
    saveLyricsInStore(lyrics, render);
    saveLyricsInCache(id, lyrics);
  });
};

export { fetchHappiLyrics };
