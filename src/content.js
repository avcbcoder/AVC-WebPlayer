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
import {
  addMediaButtonSupport,
  handleMultimediaAudio
} from "./modules/multimedia-player";

const storage = chrome.storage.local;
storage.set({ store: DEFAULT_STORE });

// initial setup
window.tabInfo = {
  isDocVisible: document.visibilityState,
  isPipEnabled: false,
  isFirstTime: true,
  isPlayerVisible: false
};

function mediaControl(media) {
  chrome.runtime.sendMessage({
    type: "change-media",
    button: media
  });
}

function onClose() {
  const tabInfo = window.tabInfo;
  tabInfo.isPlayerVisible = false;
  const extPlayer = document.getElementById(ID.EXTENSION_PLAYER);
  if (extPlayer) extPlayer.style.display = "none";
}

function addPlayer() {
  const extPlayer = document.createElement("div");
  extPlayer.id = ID.EXTENSION_PLAYER;
  extPlayer.style.zIndex = 9999999;
  // extPlayer.style.display = "none";
  document.body.appendChild(extPlayer);
}

function addPip() {
  let extBody = document.getElementById(ID.EXTENSION_BODY);
  if (!extBody) {
    extBody = document.createElement("div");
    extBody.id = ID.EXTENSION_BODY;
    extBody.style.width = "0px";
    extBody.style.height = "0px";
    extBody.style.overflow = "hidden";
    extBody.style.position = "fixed";
    extBody.style.top = "-2020px";
    extBody.style.left = "-2020px";
    document.body.appendChild(extBody);
  }
}

function renderPlayer() {
  const extPlayer = document.getElementById(ID.EXTENSION_PLAYER);
  storage.get(["store"], result => {
    console.log(result.store);
    if (extPlayer)
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

function renderPip(requestMethod) {
  storage.get(["store"], result => {
    createSpotifyWindow(result.store);
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("request =>",request)
  if (request.message === "clicked_browser_action") {
    const tabInfo = window.tabInfo;
    if (tabInfo.isFirstTime) {
      tabInfo.isFirstTime = false;
      tabInfo.isPlayerVisible = true;
      addPlayer();
      addPip();
      addMediaButtonSupport();
      renderPlayer();
    } else {
      // make all things invisible
      const extPlayer = document.getElementById(ID.EXTENSION_PLAYER);
      if (tabInfo.isPlayerVisible) {
        tabInfo.isPlayerVisible = false;
        if (extPlayer) extPlayer.style.display = "none";
      } else {
        tabInfo.isPlayerVisible = true;
        if (extPlayer) extPlayer.style.display = "block";
        renderPlayer();
        if (
          request &&
          (request.method === "song-change" || request.method === "image-change")
        )
        renderPip();
      }
    }
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type !== EXT_COMM.RENDER) return;
  const extPlayer = document.getElementById(ID.EXTENSION_PLAYER);
  const extBody = document.getElementById(ID.EXTENSION_BODY);
  const tabInfo = window.tabInfo;
  if (tabInfo.isPlayerVisible) {
    renderPlayer();
  }
  if (tabInfo.isPlayerVisible || tabInfo.isPipEnabled) {
    if (
      request &&
      (request.method === "song-change" || request.method === "image-change")
    )
      renderPip();
  }
  storage.get(["store"], result => {
    const store = result.store;
    const { playing } = store[STORE_VAR.SONG];
    handleMultimediaAudio(playing);
  });
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    const tabInfo = window.tabInfo;
    tabInfo.isPlayerVisible = false;
    const extPlayer = document.getElementById(ID.EXTENSION_PLAYER);
    if (extPlayer) extPlayer.style.display = "none";
  }
});
