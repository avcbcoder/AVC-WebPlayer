/*global chrome*/
import { STORE_VAR, CACHE_VAR, YOUTUBE_V3_SEARCH } from "../../constants.js";
import { WALLPAPER_ALPHA_CODER_API_KEYS } from "../../../../config.js";
import { render } from "../../sender.js";

const storage = chrome.storage.local;

function getImageUrls(data) {
  const { success, wallpapers } = data;
  const images = [];
  if (success) {
    wallpapers.forEach(wallpaper => {
      const { url_image, width, height } = wallpaper;
      images.push({ width, height, imageUrl: url_image });
    });
  }
  return images;
}

function fetch(searchString, callback) {
  const url = `https://wall.alphacoders.com/api2.0/get.php?auth=${
    WALLPAPER_ALPHA_CODER_API_KEYS[0]
  }&method=search&term=${searchString}`;
  $.get(url, data => {
    callback(getImageUrls(data));
  });
}

function saveInStore(data) {
  storage.get(["store"], result => {
    const store = result.store;
    chrome.extension
    .getBackgroundPage()
    .console.log("current store in alpha ", store);
    store[STORE_VAR.ALPHA] = { state: "success", response: data };
    chrome.extension
      .getBackgroundPage()
      .console.log("new store in alpha ", store);
    storage.set({ store: store }, () => {
      render({ method: "image-change" });
    });
  });
}

function saveInCache(id, data) {
  storage.get(["cache"], result => {
    const cache = result.cache;
    const cacheImages = cache[CACHE_VAR.ALPHA];
    cacheImages[id] = data;
    storage.set({ cache });
  });
}

const fetchAlphaImages = songDetails => {
  const { artist } = songDetails;
  const searchString = artist[0];
  const id = searchString; // will change it to hash later

  storage.get(["cache"], result => {
    // search in the cache first
    const cache = result.cache;
    const cacheImages = cache[CACHE_VAR.ALPHA];
    const images = cacheImages[id];

    if (images) {
      saveInStore(images);
    } else {
      fetch(searchString, data => {
        saveInStore(data);
        saveInCache(id, data);
      });
    }
  });
};

export { fetchAlphaImages };
