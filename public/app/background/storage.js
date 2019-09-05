import { STORE_VAR, CACHE_VAR } from "./constants.js";

function cacheCheck(callback) {
  const storage = chrome.storage.local;
  storage.get(["cache"], result => {
    // wheteher cache is initialised or not
    const cache = result.cache;
    if (cache) {
      callback();
    } else {
      const defaultCache = {};
      defaultCache[CACHE_VAR.VIDEO] = {};
      defaultCache[CACHE_VAR.LYRICS] = {};
      defaultCache[CACHE_VAR.HAPPI] = {};
      storage.set({ cache: defaultCache }, callback);
    }
  });
}

export { cacheCheck };
