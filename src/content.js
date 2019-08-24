/*global chrome*/
import React from 'react';
import ReactDOM from 'react-dom';
import RootApp from './modules/root-module';
import { MODE, STORE_VAR } from './constants';
import fetchApi from './api';

const DEFAULT_STORE = {
  mode: MODE.MODE_SPOTIFY,
  store_song: {
    title: '',
    artist: [],
    albumArt: '',
    progressTime: '',
    totalTime: '',
    playing: '',
  },
  store_lyrics: {
    state: '',
    data: ''
  },
  store_youtube: {
    state: '',
    data: ''
  }
}

const storage = chrome.storage.local
storage.set({ 'store': DEFAULT_STORE }, () => {
  renderComponent()
})

const app = document.createElement('div');
app.id = "my-extension";
app.style.zIndex = 9999999;
app.style.display = "none";
document.body.appendChild(app);

function mediaControl(media) {
  chrome.runtime.sendMessage({
    type: "media", options: {
      type: media
    }
  });
}

function onClose(c) {
  app.style.display = "none";
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "clicked_browser_action") {
      console.log(request.tabs)
      toggle();
    }
  }
);

const renderComponent = () => {
  storage.get(['store'], (result) => {
    ReactDOM.render(
      <RootApp
        store={result.store}
        mediaControl={mediaControl}
        onClose={onClose}
      />,
      app
    );
  })
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type !== "spotify")
    return

  if (request.method === 'song-change') {
    console.log("SONG CHANGE---------")
    storage.get(['store'], (result) => {// modify song details and set default state for fetch
      const store = result.store
      store[STORE_VAR.SONG] = request.data
      store[STORE_VAR.LYRICS] = { state: 'fetching', data: '' }
      store[STORE_VAR.YOUTUBE] = { state: 'fetching', data: '' }
      store[STORE_VAR.MODE] = ''
      storage.set({ 'store': store }, () => {
        renderComponent()
        fetchApi(storage, request.data, renderComponent)
      })
    })
  } else {
    storage.get(['store'], (result) => {// modify song details
      const store = result.store
      store[STORE_VAR.SONG] = request.data
      storage.set({ 'store': store }, () => {
        renderComponent()
      })
    })
  }
});

function toggle() {
  if (app.style.display === "none") {
    app.style.display = "block";
  } else {
    app.style.display = "none";
  }
}



