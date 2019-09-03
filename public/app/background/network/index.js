/*global chrome*/

const STORE_VAR = {
  SONG: "store_song",
  YOUTUBE: "store_youtube",
  LYRICS: "store_lyrics",
  MODE: "mode"
};

const console = () => {
  //   chrome.extension.getBackgroundPage().console.log(arguments.join(" | "));
};

const render = () => {
  chrome.tabs.query({}, function(tabs) {
    // DO NOT SEND TO ALL TABS
    for (let i = 0; i < tabs.length; i++) {
      chrome.tabs.sendMessage(tabs[i].id, {
        type: "store-modified"
      });
    }
  });
};

const replace = (str, a, b) => {
  return str.split(a).join(b);
};

const filter = (str, space) => {
  let track = [];
  for (let i = 0; i < str.length; i++)
    if (str[i] === "(") break;
    else if (str[i] === " ") track.push(space);
    else
      track.push(
        (str[i] >= "a" && str[i] <= "z") || (str[i] >= "0" && str[i] <= "9")
          ? str[i]
          : ""
      );
  return track.join("");
};

const getYoutubeVideos = (searchString, successCallback) => {
  chrome.extension.getBackgroundPage().console.log("searching in youtube");
  const searchURL = `https://www.googleapis.com/youtube/v3/search`;
  $.get(
    searchURL,
    {
      part: "snippet",
      q: searchString,
      type: "video",
      key: "AIzaSyD91jOqElBJNXKvCFIfXd_VzyOXXiJuAZQ",
      maxResults:"5",
      order:"viewCount"
    },
    function(data) {
      chrome.extension.getBackgroundPage().console.log("data found", data);
    }
  );
};

const getFandomLyrics = (track, artist, successCallback, failureCallback) => {
  track = filter(track.toLowerCase(), "_");
  artist = filter(artist.toLowerCase(), "_");
  const fandomURL = `https://lyrics.fandom.com/wiki/${artist}:${track}`;
  $.ajax({
    url: fandomURL,
    success: function(htmlData) {
      const doc = new DOMParser().parseFromString(htmlData, "text/html");
      const lyricBox = doc.body.getElementsByClassName("lyricbox")[0];
      let lyrics = [];
      const allText = ele => {
        ele.childNodes.forEach((val, idx) => {
          if (val.nodeName.toString().toLowerCase() === "#text")
            lyrics.push(
              val ? (val.data ? replace(val.data, "\n", "") : "") : ""
            );
          else if (val.nodeName.toString().toLowerCase() === "br")
            lyrics.push("\n");
          else allText(val);
        });
      };
      allText(lyricBox);
      successCallback(lyrics.join(""));
    },
    statusCode: {
      404: function() {
        failureCallback();
      }
    },
    error: function() {
      failureCallback();
    },
    fail: function() {
      failureCallback();
    }
  });
};

const getAzLyrics = (track, artist, successCallback, failureCallback) => {
  track = filter(track.toLowerCase(), "");
  artist = filter(artist.toLowerCase(), "");
  const azURL = `https://www.azlyrics.com/lyrics/${artist}/${track}.html`;
  $.ajax({
    url: azURL,
    success: function(htmlData) {
      const doc = new DOMParser().parseFromString(htmlData, "text/html");
      const ringtone = doc.body.getElementsByClassName("ringtone")[0];
      const sibling = ringtone.parentElement.childNodes;

      let lyricBox = document.createElement("div");
      for (let i = 0; i < sibling.length; i++) {
        if (sibling[i].childNodes.length > lyricBox.childNodes.length)
          lyricBox = sibling[i];
      }
      let lyrics = [];
      lyricBox.childNodes.forEach((val, idx) => {
        if (val.nodeName.toString().toLowerCase() === "#text")
          lyrics.push(val ? (val.data ? replace(val.data, "\n", "") : "") : "");
        if (val.nodeName.toString().toLowerCase() === "br") lyrics.push("\n");
      });
      successCallback(replace(lyrics.join(""), "\n\n\n", "\n\n"));
    },
    statusCode: {
      404: function() {
        failureCallback();
      }
    },
    error: function() {
      failureCallback();
    },
    fail: function() {
      failureCallback();
    }
  });
};

const fetchApi = (storage, songDetails) => {
  const { title, artist } = songDetails;

  const onSuccessLyrics = lyrics => {
    storage.get(["store"], result => {
      const store = result.store;
      if (store[STORE_VAR.LYRICS].state !== "success")
        store[STORE_VAR.LYRICS] = { state: "success", data: lyrics };
      storage.set({ store: store }, function() {
        render();
      });
    });
  };

  const onFailureLyrics = () => {
    storage.get(["store"], result => {
      const store = result.store;
      if (store[STORE_VAR.LYRICS].state === "fetching")
        store[STORE_VAR.LYRICS] = { state: "fail", data: "" };
      storage.set({ store: store }, function() {
        render();
      });
    });
  };

  for (let i = 0; i < artist.length; i++) {
    getFandomLyrics(title, artist[i], onSuccessLyrics, onFailureLyrics);
    getAzLyrics(title, artist[i], onSuccessLyrics, onFailureLyrics);
  }

  const searchString = title + " " + artist.join(" ");
  getYoutubeVideos(searchString, videos => {});
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type !== "spotify") return;

  const isSongChanged = request.type === "spotify";
  const storage = chrome.storage.local;

  storage.get(["store"], result => {
    // modify song details and set default state for fetch
    const store = result.store;
    store[STORE_VAR.SONG] = request.data;
    store[STORE_VAR.LYRICS] = isSongChanged
      ? { state: "fetching", data: "" }
      : store[STORE_VAR.LYRICS];
    store[STORE_VAR.YOUTUBE] = isSongChanged
      ? { state: "fetching", data: "" }
      : store[STORE_VAR.YOUTUBE];
    storage.set({ store: store }, () => {
      render();
    });
  });

  if (request.method === "song-change") {
    fetchApi(storage, request.data);
  }
});
