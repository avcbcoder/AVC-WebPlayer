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

function onClose() {
  removePlayer();
  removePip();
}

function addPlayer() {
  const extPlayer = document.createElement("div");
  extPlayer.id = ID.EXTENSION_PLAYER;
  extPlayer.style.zIndex = 9999999;
  // extPlayer.style.display = "none";
  document.body.appendChild(extPlayer);
  console.log("added player", extPlayer);
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
}

function addPip() {
  let extBody = document.getElementById(ID.EXTENSION_BODY);
  if (!extBody) {
    extBody = document.createElement("div");
    extBody.id = ID.EXTENSION_BODY;
    extBody.style.width = "0px";
    extBody.style.height = "0px";
    // extBody.style.overflow = "hidden";
    document.body.appendChild(extBody);
  }
}

function removePlayer() {
  // remove extension injected player component
  const extPlayer = document.getElementById(ID.EXTENSION_PLAYER);
  if (extPlayer) extPlayer.parentNode.removeChild(extPlayer);
}

function removePip() {
  // remove extension injected pip component
  const extBody = document.getElementById(ID.EXTENSION_BODY);
  if (!window.pip && extBody) extBody.parentNode.removeChild(extBody);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("RECIEVED REQ ->", request);
  if (request.message === "clicked_browser_action") {
    let extPlayer = document.getElementById(ID.EXTENSION_PLAYER);
    if (extPlayer) {
      console.log("removing player");
      removePlayer();
      removePip();
    } else {
      console.log("adding player");
      addPlayer();
      addPip();
    }
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type !== EXT_COMM.RENDER) return;
  const extPlayer = document.getElementById(ID.EXTENSION_PLAYER);
  const extBody = document.getElementById(ID.EXTENSION_BODY);
  storage.get(["store"], result => {
    if (extPlayer) {
      console.log("Updating ext player");
      ReactDOM.render(
        <RootApp
          store={result.store}
          mediaControl={mediaControl}
          onClose={onClose}
        />,
        extPlayer
      );
    }
    if (extBody && request && request.method === "song-change") {
      console.log("Updating ext window");
      createSpotifyWindow(result.store);
    }
  });
});

// function toggle() {
//   if (extPlayer.style.display === "none") {
//     extPlayer.style.display = "block";
//   } else {
//     extPlayer.style.display = "none";
//   }
// }

// tabChage : onBackground -> remove player and remove pip(if pip not enabled)
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    console.log("document hidden removing things");
    removePlayer();
    removePip();
  }
});
