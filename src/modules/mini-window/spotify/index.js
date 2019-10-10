/*global chrome*/
import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import domtoimage from "dom-to-image";
import { ID, STORE_VAR } from "../../../constants";
import $ from "jquery";
import { handleMultimediaAudio } from "../../multimedia-player";

import WindowView from "./view";

const storage = chrome.storage.local;

/** Refrences => https://stackoverflow.com/questions/49930680/how-to-handle-uncaught-in-promise-domexception-play-failed-because-the-use*/
/** https://developers.google.com/web/updates/2017/09/autoplay-policy-changes */
/** chrome://flags/#autoplay-policy */

function videoLoaded() {
  let count = 0;
  const ele = document.getElementById(ID.FRAME.SPOTIFY);
  const intervalId = setInterval(() => {
    if (count === 1) {
      const video = document.getElementById(ID.VIDEO.SPOTIFY);
      video.play();
      clearInterval(intervalId);
    } else {
      domtoimage.toPng(ele).then(function(dataUrl) {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          const canvas = document.getElementById(ID.CANVAS.SPOTIFY);
          const context = canvas.getContext("2d");
          context.drawImage(img, 0, 0);
        };
      });
    }
    count++;
  }, 1000);
}

function attachListenersToVideo(video) {
  if (!video) return;
  video.addEventListener("enterpictureinpicture", () => {
    window.pip = true;
    const tabInfo = window.tabInfo;
    tabInfo.isPipEnabled = true;
  });
  video.addEventListener("leavepictureinpicture", () => {
    window.pip = false;
    const tabInfo = window.tabInfo;
    tabInfo.isPipEnabled = false;
    const canvas = document.getElementById(ID.CANVAS.SPOTIFY);
    const video = document.getElementById(ID.VIDEO.SPOTIFY);
    if (video) {
      video.src = "";
      video.parentNode.removeChild(video);
    }
    if (canvas) canvas.parentNode.removeChild(canvas);
    registerFrame();
    handleMultimediaAudio(false);
  });
  video.addEventListener("loadeddata", videoLoaded, false);
  video.addEventListener("ended", () => {
    video.play();
  });
}

const createSpotifyWindow = (store) => {
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
  ReactDOM.render(<Window store={store}/>, comp);
};

function registerFrame() {
  const ele = document.getElementById(ID.FRAME.SPOTIFY);
  domtoimage.toPng(ele).then(function(dataUrl) {
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
  });
}

function onLoad() {
  const canvas = document.getElementById(ID.CANVAS.SPOTIFY);
  if (!canvas) {
    registerFrame();
    return;
  }
  let count = 0;
  const ele = document.getElementById(ID.FRAME.SPOTIFY);
  const intervalId = setInterval(() => {
    if (count === 1) {
      clearInterval(intervalId);
    } else {
      const cttt=new Date().getTime();
      domtoimage.toPng(ele).then(function(dataUrl) {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          const canvas = document.getElementById(ID.CANVAS.SPOTIFY);
          const context = canvas.getContext("2d");
          context.drawImage(img, 0, 0);
        console.log("DOM TO Imgae took ",new Date().getTime()-cttt)
        };
      });
    }
    count++;
  }, 100);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Window({ store }) {
  const song = store[STORE_VAR.SONG];
  const images = store[STORE_VAR.ALPHA].response;
  const image = images[getRandomInt(0, images.length) % images.length];
  return (
    <WindowView
      song={song}
      image={
        image ? image.imageUrl : "https://images.alphacoders.com/906/906319.jpg"
      }
      onLoad={onLoad}
    />
  );
}

export default createSpotifyWindow;
