/*global chrome*/
import React from 'react';
import ReactDOM from 'react-dom';
import RootApp from './modules/root-module';
import { MODE } from './constants';

import { getFandomLyrics, getAzLyrics } from './api/lyrics'
import { youtubeSearch } from './api/youtube-search'

function mediaControl(media) {
  console.log('media buttons clicked', media)
  chrome.runtime.sendMessage({
    type: "media", options: {
      type: media
    }
  });
}

function onClose(c) {
  console.log('called on close')
  app.style.display = "none";
}

const app = document.createElement('div');
app.id = "my-extension";
app.style.zIndex = 9999999;
app.style.display = "none";
document.body.appendChild(app);
ReactDOM.render(<RootApp mediaControl={mediaControl} onClose={onClose} />, app);

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "clicked_browser_action") {
      console.log(request.tabs)
      toggle();
    }
  }
);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "current-song-details" || request.type === "current-song-details") {
    ReactDOM.render(<RootApp mode={MODE.SPOTIFY} songDetails={request.songDetailsObj} mediaControl={mediaControl} onClose={onClose} />, app);
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type !== "spotify")
    return

  switch (request.method) {
    case 'song-change':

      break;
    case 'progress-change':

      break;

    case 'play-state-change':

      break;

    default:
      break;
  }

  ReactDOM.render(
    <RootApp
      mode={MODE.SPOTIFY}
      songDetails={request.songDetailsObj}
      mediaControl={mediaControl}
      onClose={onClose}
    />,
    app
  );
});

function toggle() {
  if (app.style.display === "none") {
    app.style.display = "block";
  } else {
    app.style.display = "none";
  }
}



