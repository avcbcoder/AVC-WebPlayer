/*global chrome*/
import React from "react";
import ReactDOM from "react-dom";
import RootApp from "./modules/root-module";
import { MODE, STORE_VAR, EXT_COMM, MINI_MODE } from "./constants";

const DEFAULT_STORE = {
  mode: MODE.MODE_SPOTIFY,
  store_song: {
    title: "",
    artist: [],
    albumArt: "",
    progressTime: "0:00",
    totalTime: "3:51",
    playing: ""
  },
  store_lyrics: {
    state: "",
    response: ""
  },
  store_youtube: {
    state: "",
    response: ""
  },
  store_happi: {
    state: "",
    response: ""
  }
};

const storage = chrome.storage.local;

storage.set({ store: DEFAULT_STORE }, () => {
  renderComponent();
});

const app = document.createElement("div");
app.id = "my-extension";
app.style.zIndex = 9999999;
app.style.display = "none";
document.body.appendChild(app);

function mediaControl(media) {
  chrome.runtime.sendMessage({
    type: "change-media",
    button: media
  });
}

function onClose(c) {
  app.style.display = "none";
}

function miniWindow(type) {
  switch (type) {
    case MINI_MODE.none:
      break;
    case MINI_MODE.spotify:
      break;
    case MINI_MODE.lyrics:
      break;
    case MINI_MODE.youtube:
      break;
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "clicked_browser_action") {
    console.log(request.tabs);
    toggle();
  }
});

const renderComponent = () => {
  storage.get(["store"], result => {
    console.log("STORE=>", result.store);
    ReactDOM.render(
      <RootApp
        store={result.store}
        mediaControl={mediaControl}
        onClose={onClose}
        miniWindow={miniWindow}
      />,
      app
    );
  });
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === EXT_COMM.RENDER) renderComponent();
});

function toggle() {
  if (app.style.display === "none") {
    app.style.display = "block";
  } else {
    app.style.display = "none";
  }
}
