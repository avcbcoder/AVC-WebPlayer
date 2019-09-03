import { getAzLyrics } from "./az.js";
import { getFandomLyrics } from "./fandom.js";
import { STORE_VAR, CACHE_VAR } from "../../constants.js";

function saveInStore(data, render) {
  storage.get(["store"], result => {
    const store = result.store;
    if (store[STORE_VAR.LYRICS].state !== "success")
      store[STORE_VAR.LYRICS] = { state: data ? "success" : "fail", data };
    storage.set({ store }, render);
  });
}

function saveInCache(id, data) {
  storage.get(["cache"], result => {
    const cache = result.cache;
    const cacheLyrics = cache[CACHE_VAR.LYRICS];
    cacheLyrics[id] = data;
    storage.set({ cache }, function() {});
  });
}

const fetchLyrics = (storage, songDetails, render) => {
  const { title, artist } = songDetails;
  const searchString = title + " " + artist.join(" ");
  const id = searchString; // will change it to hash later

  storage.get(["cache"], result => {
    // search in the cache first
    const cache = result.cache;
    const cacheLyrics = cache[CACHE_VAR.LYRICS];
    const lyrics = cacheLyrics[id];

    if (lyrics) {
      saveInStore(lyrics, render);
    } else {
      
      const onSuccessLyrics = data => {
        saveInStore(data, render);
        saveInCache(id, data);
      };

      const onFailureLyrics = () => {
        saveInStore("", render);
      };

      for (let i = 0; i < artist.length; i++) {
        getFandomLyrics(title, artist[i], onSuccessLyrics, onFailureLyrics);
        getAzLyrics(title, artist[i], onSuccessLyrics, onFailureLyrics);
      }
    }
  });
};

export { fetchLyrics };
