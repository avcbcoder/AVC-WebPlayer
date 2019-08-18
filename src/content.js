/*global chrome*/
import React from 'react';
import ReactDOM from 'react-dom';
import RootApp from './modules/root-module';
import { MODE } from './constants';
import fetchApi from './api';


const storage = chrome.storage.local
/**
 * store :{
 *    lyrics :{
 *     
 *      },
 * song :songObj,
 * ytVideos:videos
 * }
 */

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


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type !== "spotify")
    return

  if (request.method === 'song-change')
    fetchApi(storage, request.data, renderComponent)

  storage.get('store', (store) => {// modify song details
    store.songs = request.data
    storage.set('store', store)
  })

  renderComponent(MODE.SPOTIFY, request.data, '', '')
});

function toggle() {
  if (app.style.display === "none") {
    app.style.display = "block";
  } else {
    app.style.display = "none";
  }
}



