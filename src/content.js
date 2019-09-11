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

function mediaControl(media) {
  chrome.runtime.sendMessage({
    type: "change-media",
    button: media
  });
}

function onClose(c) {
  extPlayer.style.display = "none";
}

function onPipEnter() {
  window.pip = true;
}

function onPipExit() {
  // if this tab is in background
  window.pip = false;
  if (document.visibilityState === "hidden") {
    const extBody = document.getElementById(ID.EXTENSION_BODY);
    if (extBody) extBody.parentNode.removeChild(extBody);
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "clicked_browser_action") {
    console.log(request.tabs);
    let extPlayer = document.getElementById(ID.EXTENSION_PLAYER);
    let extBody = document.getElementById(ID.EXTENSION_BODY);
    if (extPlayer) {
      // remove extension injected player component
      if (extPlayer) extPlayer.parentNode.removeChild(extBody);
      // remove extension injected pip component
      if (!window.pip && extBody) extBody.parentNode.removeChild(extBody);
    } else {
      // add player component
      extPlayer = document.createElement("div");
      extPlayer.id = ID.EXTENSION_PLAYER;
      extPlayer.style.zIndex = 9999999;
      extPlayer.style.display = "none";
      document.body.appendChild(extPlayer);
      storage.set({ store: DEFAULT_STORE }, () => {
        ReactDOM.render(
          <RootApp
            store={DEFAULT_STORE}
            mediaControl={mediaControl}
            onClose={onClose}
          />,
          extPlayer
        );
      });

      // add pip component
      if (!extBody) {
        extBody = document.createElement("div");
        extBody.id = ID.EXTENSION_BODY;
        extBody.style.width = "0px";
        extBody.style.height = "0px";
        // extBody.style.overflow = "hidden";
        document.body.appendChild(extBody);
      }
    }
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === EXT_COMM.RENDER) {
    const extPlayer = document.getElementById(ID.EXTENSION_PLAYER);
    const extBody = document.getElementById(ID.EXTENSION_BODY);
    storage.get(["store"], result => {
      if (extPlayer)
        ReactDOM.render(
          <RootApp
            store={result.store}
            mediaControl={mediaControl}
            onClose={onClose}
          />,
          extPlayer
        );
      if (extBody && request && request.method === "song-change")
        createSpotifyWindow(result.store);
    });
  }
});

function toggle() {
  if (extPlayer.style.display === "none") {
    extPlayer.style.display = "block";
  } else {
    extPlayer.style.display = "none";
  }
}

// Working for tabChange listeners
// 1-> whenever tab goes in background, if pip is not enabled, remove extension body
document.addEventListener("visibilitychange", function() {
  if (document.hidden) {
    // remove extension pip body on tab change
    if (!window.pip) {
      const extBody = document.getElementById(ID.EXTENSION_BODY);
      if (extBody) extBody.parentNode.removeChild(extBody);
    }
    // remove player on tab change
    const extPlayer = document.getElementById(ID.EXTENSION_PLAYER);
    if (extPlayer) if (extPlayer) extPlayer.parentNode.removeChild(extBody);
  }
});
