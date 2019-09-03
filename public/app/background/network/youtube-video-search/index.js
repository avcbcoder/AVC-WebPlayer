function fetch(searchURL, callback) {
  chrome.extension.getBackgroundPage().console.log("searching in youtube");
  $.get(
    searchURL,
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

function save(data,render) {
  storage.get(["store"], result => {
    // save in store
    const store = result.store;
    store[STORE_VAR.YOUTUBE] = { state: "success", data };
    storage.set({ store: store }, function() {
      render();
    });
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
      save(video,render);
    } else {
      const searchURL = `https://www.googleapis.com/youtube/v3/search`;
      fetch(searchURL, data => {
        chrome.extension
          .getBackgroundPage()
          .console.log("data fetch from yt api", data);
        save(data,render);
        storage.get(["cache"], result => {
          // save in cache
          const cache = result.cache;
          cacheVideos = cache[CACHE_VAR.VIDEO];
          cacheVideos[id] = data;
          storage.set({ cache }, function() {});    
        });
      });
    }
  });
};

export { fetchYoutubeVideos };
