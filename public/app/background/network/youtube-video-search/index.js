/*global chrome*/
import { STORE_VAR, CACHE_VAR, YOUTUBE_V3_SEARCH } from "../../constants.js";
import { YOUTUBE_API_KEYS } from "../../../../config.js";
import { render } from "../../sender.js";

const storage = chrome.storage.local;

function getVideoIds(data) {
  const items = data.items;
  if (!items) return;

  const videos = [];
  items.forEach(video => {
    const videoId = video["id"]["videoId"];
    const thumbnailUrl = video["snippet"]["thumbnails"]["high"]["url"];
    videos.push({ videoId, thumbnailUrl });
  });

  return videos;
}

function fetch(searchString, callback) {
  $.get(
    YOUTUBE_V3_SEARCH,
    {
      part: "snippet",
      q: searchString,
      type: "video",
      key: YOUTUBE_API_KEYS[0],
      maxResults: "3"
    },
    data => {
      callback(getVideoIds(data));
    }
  );
}

function saveInStore(data) {
  storage.get(["store"], result => {
    const store = result.store;
    store[STORE_VAR.YOUTUBE] = { state: "success", response:data };
    storage.set({ store: store }, render);
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

const fetchYoutubeVideos = songDetails => {
  const { title, artist } = songDetails;
  const searchString = title + " " + artist.join(" ");
  const id = searchString; // will change it to hash later

  storage.get(["cache"], result => {
    // search in the cache first
    const cache = result.cache;
    const cacheVideos = cache[CACHE_VAR.VIDEO];
    const video = cacheVideos[id];

    if (video) {
      saveInStore(video);
    } else {
      fetch(searchString, data => {
        saveInStore(data);
        saveInCache(id, data);
      });
    }
  });
};

export { fetchYoutubeVideos };
