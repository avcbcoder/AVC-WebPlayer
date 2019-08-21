/*global chrome*/
import React from 'react';
import ReactDOM from 'react-dom';
import RootApp from './modules/root-module';
import { MODE } from './constants';
import fetchApi from './api';

const DEFAULT_STORE = {
  mode: MODE.MODE_SPOTIFY,
  song: {
    title: '',
    artist: [],
    albumArt: '',
    progressTime: '',
    totalTime: '',
    playing: '',
  },
  lyrics: {
    state: '',
    lyrics: ''
  },
  youtubeVideos: {
    state: '',
    videos: ''
  }
}

const storage = chrome.storage.local
storage.set({ 'store': DEFAULT_STORE })

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

const renderComponent = (mode, songDetails, lyrics, videos) => {
  ReactDOM.render(
    <RootApp
      mode={mode}
      songDetails={songDetails}
      lyrics={lyrics}
      mediaControl={mediaControl}
      onClose={onClose}
    />,
    app
  );
}

renderComponent(DEFAULT_STORE.mode, DEFAULT_STORE.song, DEFAULT_STORE.lyrics, DEFAULT_STORE.youtubeVideos)

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type !== "spotify")
    return

  if (request.method === 'song-change') {
    storage.get(['store'], (result) => {// modify song details and set default state for fetch
      const store = result.store
      store.song = request.data
      store.lyrics = { state: 'fetching', lyrics: '' }
      store.youtubeVideos = { state: 'fetching', videos: '' }
      store.mode = ''
      storage.set({ 'store': store }, () => {
        fetchApi(storage, request.data, renderComponent)
      })
    })
  } else {
    storage.get(['store'], (store) => {// modify song details
      store.song = request.data
      storage.set({ 'store': store }, () => {
      })
    })
  }
  renderComponent(MODE.SPOTIFY, request.data, '', '')
});

function toggle() {
  if (app.style.display === "none") {
    app.style.display = "block";
  } else {
    app.style.display = "none";
  }
}



