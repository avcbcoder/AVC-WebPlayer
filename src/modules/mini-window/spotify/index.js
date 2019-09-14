/*global chrome*/
import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import domtoimage from "dom-to-image";
import { ID, STORE_VAR } from "../../../constants";
import $ from "jquery";

import WindowView from "./view";

const storage = chrome.storage.local;

/** Refrences => https://stackoverflow.com/questions/49930680/how-to-handle-uncaught-in-promise-domexception-play-failed-because-the-use*/
/** https://developers.google.com/web/updates/2017/09/autoplay-policy-changes */
/** chrome://flags/#autoplay-policy */

function videoLoaded() {
  let count = 0;
  const ele = document.getElementById(ID.FRAME.SPOTIFY);
  const intervalId = setInterval(() => {
    if (count === 10) {
      const video = document.getElementById(ID.VIDEO.SPOTIFY);
      console.log("Trying to play it");
      try {
        video.play();
      } catch (err) {
        console.log("Err", err);
      }
      clearInterval(intervalId);
    } else {
      domtoimage
        .toPng(ele)
        .then(function(dataUrl) {
          const img = new Image();
          img.src = dataUrl;
          img.onload = () => {
            const canvas = document.getElementById(ID.CANVAS.SPOTIFY);
            const context = canvas.getContext("2d");
            context.drawImage(img, 0, 0);
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
    video.play();
    const extPlayer = document.getElementById(ID.EXTENSION_PLAYER);
    if (document.visibilityState === "hidden" || !extPlayer) {
      console.log("REMOVING EXT BODY SINCE PIP EXITED");
      const extBody = document.getElementById(ID.EXTENSION_BODY);
      if (extBody) extBody.parentNode.removeChild(extBody);
    } else {
      const canvas = document.getElementById(ID.CANVAS.SPOTIFY);
      const video = document.getElementById(ID.VIDEO.SPOTIFY);
      if (video) {
        video.src = "";
        video.parentNode.removeChild(video);
      }
      if (canvas) canvas.parentNode.removeChild(canvas);
      // remove comp as well
      registerFrame();
    }
  });
  video.addEventListener("loadeddata", videoLoaded, false);
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

function registerFrame() {
  console.log("REGISTER FRAME");
  const ele = document.getElementById(ID.FRAME.SPOTIFY);
  domtoimage
    .toPng(ele)
    .then(function(dataUrl) {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
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
        video.muted = "muted";
        video.autoplay = "true";
        video.srcObject = canvas.captureStream();
        attachListenersToVideo(video);
        video.load();
        spotifyMiniWindow.appendChild(video);
      };
    })
    .catch(function(error) {
      window.alert("This version of chrome does not support pictureInPicture");
    });
}

function onLoad() {
  console.log("UPDATING CANVAS");
  const canvas = document.getElementById(ID.CANVAS.SPOTIFY);
  if (!canvas) {
    registerFrame();
    return;
  }
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
            const canvas = document.getElementById(ID.CANVAS.SPOTIFY);
            const context = canvas.getContext("2d");
            context.drawImage(img, 0, 0);
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
