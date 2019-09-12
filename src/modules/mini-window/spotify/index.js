/*global chrome*/
import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import domtoimage from "dom-to-image";
import { ID, STORE_VAR } from "../../../constants";
import $ from "jquery";

import WindowView from "./view";

const storage = chrome.storage.local;

const createSpotifyWindow = store => {
  const extBody = document.getElementById(ID.EXTENSION_BODY);
  if (!extBody) return;
  let spotifyMiniWindow = document.getElementById(ID.WINDOW.SPOTIFY);
  if (!spotifyMiniWindow) {
    spotifyMiniWindow = document.createElement("div");
    spotifyMiniWindow.id = ID.WINDOW.SPOTIFY;
    extBody.appendChild(spotifyMiniWindow);
  }
  ReactDOM.render(<Window store={store} />, spotifyMiniWindow);
};

const onSongChange = () => {};

function attachListenersToVideo(video) {
  if (!video) return;
  video.addEventListener("enterpictureinpicture", () => {
    console.log("PIP ENTER");
    window.pip = true;
    storage.set({ pip: true }); //remove it later
  });
  video.addEventListener("leavepictureinpicture", () => {
    console.log("PIP EXIT");
    window.pip = false;
    storage.set({ pip: false }); //remove it later
    if (document.visibilityState === "hidden") {
      console.log("REMOVING EXT BODY SINCE PIP EXITED");
      const extBody = document.getElementById(ID.EXTENSION_BODY);
      if (extBody) extBody.parentNode.removeChild(extBody);
    }
  });
}

function capture() {
  const ele = document.getElementById(ID.FRAME.SPOTIFY);
  domtoimage
    .toPng(ele)
    .then(function(dataUrl) {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        let canvas = document.getElementById(ID.CANVAS.SPOTIFY);
        let video = document.getElementById(ID.VIDEO.SPOTIFY);
        if (!canvas) {
          // create canvas
          const extBody = document.getElementById(ID.EXTENSION_BODY);
          canvas = document.createElement("canvas");
          canvas.id = ID.CANVAS.SPOTIFY;
          canvas.width = img.width;
          canvas.height = img.height;
          extBody.appendChild(canvas);
          // draw image on canvas
          const context = canvas.getContext("2d");
          context.drawImage(img, 0, 0);
          // create video element
          video = document.createElement("video");
          video.id = ID.VIDEO.SPOTIFY;
          extBody.appendChild(video);
          video.srcObject = canvas.captureStream();
          video.play();
          attachListenersToVideo(video);
        } else {
          // draw image repeatedly
          const context = canvas.getContext("2d");
          context.drawImage(img, 0, 0);
        }
      };
    })
    .catch(function(error) {
      console.error("oops, something went wrong!", error);
    });
}

function onLoad() {
  let count = 0;
  const intervalId = setInterval(() => {
    if (count === 10) {
      clearInterval(intervalId);
      return;
    }
    count++;
    capture();
  }, 100);
}

function Window({ store }) {
  const song = store[STORE_VAR.SONG];
  return <WindowView song={song} ratio="20" onLoad={onLoad} />;
}

export default createSpotifyWindow;
