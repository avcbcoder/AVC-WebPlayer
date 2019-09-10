/*global chrome*/
import React from "react";
import ReactDOM from "react-dom";
import RootApp from "./modules/root-module";
import {
  MODE,
  STORE_VAR,
  EXT_COMM,
  MINI_MODE,
  ID,
  DEFAULT_STORE
} from "./constants";
import { createSpotifyWindow } from "./modules/mini-window";

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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "clicked_browser_action") {
    console.log(request.tabs);
    toggle();
    // const spotifyMiniWindow = document.getElementById(ID.WINDOW.SPOTIFY);
    // if (spotifyMiniWindow) {
    //   if (!document.pictureInPictureElement)
    //     spotifyMiniWindow.parentNode.removeChild(spotifyMiniWindow);
    // } else {
    //   storage.get(["store"], result => {
    //     createSpotifyWindow(result.store);
    //   });
    // }
  }
});

const renderComponent = request => {
  storage.get(["store"], result => {
    console.log("STORE=>", result.store);
    ReactDOM.render(
      <RootApp
        store={result.store}
        mediaControl={mediaControl}
        onClose={onClose}
      />,
      app
    );
    if (request && request.method === "song-change")
      createSpotifyWindow(result.store);
  });
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === EXT_COMM.RENDER) renderComponent(request);
});

function toggle() {
  if (app.style.display === "none") {
    app.style.display = "block";
  } else {
    app.style.display = "none";
  }
}

// Working for onBlur listeners
// 1-> whenever tab goes in background, if pip is not enabled, remove extension body
document.addEventListener("visibilitychange", function() {
  if (document.hidden) {
    if (document.pictureInPictureElement) return;
    const extensionBody = document.getElementById(ID.EXTENSION_BODY);
    if (extensionBody) extensionBody.parentNode.removeChild(extensionBody);
  } else {
    console.log("Browser tab is visible");
  }
});
