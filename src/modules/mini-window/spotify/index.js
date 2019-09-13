/*global chrome*/
import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import domtoimage from "dom-to-image";
import { ID, STORE_VAR } from "../../../constants";
import $ from "jquery";

import WindowView from "./view";

const storage = chrome.storage.local;

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
    const extPlayer = document.getElementById(ID.EXTENSION_PLAYER);
    if (document.visibilityState === "hidden" || !extPlayer) {
      console.log("REMOVING EXT BODY SINCE PIP EXITED");
      const extBody = document.getElementById(ID.EXTENSION_BODY);
      if (extBody) extBody.parentNode.removeChild(extBody);
    }
  });
}

const createSpotifyWindow = store => {
  const extBody = document.getElementById(ID.EXTENSION_BODY);
  if (!extBody) return;

  let spotifyMiniWindow = document.getElementById(ID.WINDOW.SPOTIFY);
  let comp = document.getElementById(ID.COMP.SPOTIFY);

  if (!spotifyMiniWindow || !comp) {
    spotifyMiniWindow = document.createElement("div");
    spotifyMiniWindow.id = ID.WINDOW.SPOTIFY;

    comp = document.createElement("div");
    comp.id = ID.COMP.SPOTIFY;
    spotifyMiniWindow.appendChild(comp);

    extBody.appendChild(spotifyMiniWindow);
  }
  ReactDOM.render(<Window store={store} />, comp);
};

function registerFrame(img) {
  const spotifyMiniWindow = document.getElementById(ID.WINDOW.SPOTIFY);
  const canvas = document.createElement("canvas");
  canvas.id = ID.CANVAS.SPOTIFY;
  canvas.width = img.width;
  canvas.height = img.height;
  const context = canvas.getContext("2d");
  context.drawImage(img, 0, 0);
  spotifyMiniWindow.appendChild(canvas);
  const video = document.createElement("video");
  video.id = ID.VIDEO.SPOTIFY;
  video.srcObject = canvas.captureStream();
  video.play();
  attachListenersToVideo(video);
  spotifyMiniWindow.appendChild(video);
}

function refreshFrame(canvas, img) {
  const context = canvas.getContext("2d");
  context.drawImage(img, 0, 0);
}

function onLoad() {
  console.log("UPDATING CANVAS");
  let count = 0;
  const ele = document.getElementById(ID.FRAME.SPOTIFY);
  const intervalId = setInterval(() => {
    if (count === 10) {
      clearInterval(intervalId);
    } else {
      domtoimage
        .toPng(ele)
        .then(function(dataUrl) {
          const img = new Image();
          img.src = dataUrl;
          img.onload = () => {
            let canvas = document.getElementById(ID.CANVAS.SPOTIFY);
            if (!canvas) {
              registerFrame(img);
            } else {
              refreshFrame(canvas, img);
            }
          };
        })
        .catch(function(error) {
          window.alert(
            "This version of chrome does not support pictureInPicture"
          );
        });
    }
    count++;
  }, 100);
}

function Window({ store }) {
  const song = store[STORE_VAR.SONG];
  return (
    <WindowView
      song={song}
      image="https://images7.alphacoders.com/905/905837.jpg"
      onLoad={onLoad}
    />
  );
}

export default createSpotifyWindow;
