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
storage.set({ store: DEFAULT_STORE });

window.tabInfo = {
  isDocVisible: document.visibilityState,
  isPipEnabled: false,
  isFirstTime: true,
  isAcceptingChanges: false
};

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
  console.log("add player");
  const extPlayer = document.createElement("div");
  extPlayer.id = ID.EXTENSION_PLAYER;
  extPlayer.style.zIndex = 9999999;
  // extPlayer.style.display = "none";
  document.body.appendChild(extPlayer);
  storage.get(["store"], result => {
    ReactDOM.render(
      <RootApp
        store={result.store}
        mediaControl={mediaControl}
        onClose={onClose}
      />,
      extPlayer
    );
  });
}

function addPip() {
  console.log("add pip");
  let extBody = document.getElementById(ID.EXTENSION_BODY);
  if (!extBody) {
    extBody = document.createElement("div");
    extBody.id = ID.EXTENSION_BODY;
    extBody.style.width = "0px";
    extBody.style.height = "0px";
    extBody.style.overflow = "hidden";
    document.body.appendChild(extBody);
  }
}

function removePlayer() {
  console.log("remove player");
  // remove extension injected player component
  const extPlayer = document.getElementById(ID.EXTENSION_PLAYER);
  if (extPlayer) extPlayer.parentNode.removeChild(extPlayer);
}

function removePip() {
  // remove extension injected pip component
  console.log("remove pip");
  const extBody = document.getElementById(ID.EXTENSION_BODY);
  console.log("TRYING TO REMOVE PIP=>", window.pip, extBody);
  if (!window.pip && extBody) extBody.parentNode.removeChild(extBody);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "clicked_browser_action") {
    console.log("BROWSER ACTION =>", request);

    let extPlayer = document.getElementById(ID.EXTENSION_PLAYER);
    if (extPlayer) {
      console.log("ext player found");
      removePlayer();
      removePip();
    } else {
      console.log("ext player not found");
      addPlayer();
      addPip();
    }
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type !== EXT_COMM.RENDER) return;
  console.log("RENDER this =>", request);
  const extPlayer = document.getElementById(ID.EXTENSION_PLAYER);
  const extBody = document.getElementById(ID.EXTENSION_BODY);
  storage.get(["store"], result => {
    if (extPlayer) {
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
      createSpotifyWindow(result.store);
    }
  });
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    console.log("DOCUMENT HIDDEN");
    removePlayer();
    removePip();
  } else console.log("DOCUMENT SHOWN");
});
