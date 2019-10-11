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
const STATUS = {
  DEFAULT: "default",
  THUMB: "thumbnail",
  HD: "highDefinition"
};

const DEFAULT_IMAGE_URL = "https://images.alphacoders.com/906/906319.jpg";

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

const createSpotifyWindow = (store, isSongChanged) => {
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
  ReactDOM.render(<Window store={store} isSongChanged={isSongChanged} />, comp);
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
      const cttt = new Date().getTime();
      domtoimage.toPng(ele).then(function(dataUrl) {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          const canvas = document.getElementById(ID.CANVAS.SPOTIFY);
          const context = canvas.getContext("2d");
          context.drawImage(img, 0, 0);
          console.log("DOM TO Imgae took ", new Date().getTime() - cttt);
        };
      });
    }
    count++;
  }, 100);
}

class Window extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageStatus: STATUS.DEFAULT,
      currentImageUrl: DEFAULT_IMAGE_URL,
      image: null,
      songHash: null
    };
  }

  static getDerivedStateFromProps(props, state) {
    console.log("getDerivedStateFromProps called");
    const { store } = props;
    const { songHash } = state;

    const song = store[STORE_VAR.SONG];
    const { title, artist } = song;
    const hashArr = [title];
    for (let i = 0; i < artist.length; i++) hashArr.push(artist[i]);
    const hash = hashArr.join("");

    if (hash !== songHash) {
      const images = store[STORE_VAR.ALPHA].response;
      const image =
        images[Math.floor(Math.random() * (images.length + 1)) % images.length];

      return {
        imageStatus: STATUS.DEFAULT,
        currentImageUrl: DEFAULT_IMAGE_URL,
        songHash: hash,
        image
      };
    } else {
      const { image } = state;

      if (!image) {
        const images = store[STORE_VAR.ALPHA].response;
        const newImage =
          images[
            Math.floor(Math.random() * (images.length + 1)) % images.length
          ];
        return { image: newImage };
      }
    }

    return {};
  }

  viewImageLoaded = () => {
    console.log("viewImageLoaded called");
    onLoad();
    const { imageStatus, image } = this.state;
    if (imageStatus === STATUS.DEFAULT) {
      if (image)
        this.setState({
          imageStatus: STATUS.THUMB,
          currentImageUrl: image.thumbUrl
        });
    } else if (imageStatus === STATUS.THUMB) {
      if (image)
        this.setState({
          imageStatus: STATUS.HD,
          currentImageUrl: image.imageUrl
        });
    }
  };

  render() {
    const { currentImageUrl } = this.state;
    const { store } = this.props;
    const song = store[STORE_VAR.SONG];

    return (
      <WindowView
        song={song}
        image={currentImageUrl}
        onLoad={this.viewImageLoaded}
      />
    );
  }
}

export default createSpotifyWindow;
