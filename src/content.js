/*global chrome*/
import React from 'react';
import ReactDOM from 'react-dom';
import RootApp from './app';
import { MODE } from './constants';

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
app.style.zIndex = 900000;
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

function toggle() {
  if (app.style.display === "none") {
    app.style.display = "block";
  } else {
    app.style.display = "none";
  }
}



