import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import domtoimage from "dom-to-image";
import { ID, STORE_VAR } from "../../../constants";
import $ from "jquery";

import WindowView from "./view";

const createSpotifyWindow = store => {
  let extensionBody = document.getElementById(ID.EXTENSION_BODY);
  if (!extensionBody) {
    extensionBody = document.createElement("div");
    extensionBody.id = ID.EXTENSION_BODY;
    extensionBody.style.width = "0px";
    extensionBody.style.height = "0px";
    extensionBody.style.overflow = "hidden";
    document.body.appendChild(extensionBody);
  }

  let spotifyMiniWindow = document.getElementById(ID.WINDOW.SPOTIFY);
  if (!spotifyMiniWindow) {
    spotifyMiniWindow = document.createElement("div");
    spotifyMiniWindow.id = ID.WINDOW.SPOTIFY;
    extensionBody.appendChild(spotifyMiniWindow);
  }
  ReactDOM.render(<Window store={store} />, spotifyMiniWindow);
};

class Window extends React.Component {
  constructor(props) {
    super(props);
    this.intervalId = "";
  }

  componentWillUnmount() {
    console.log("UNMOUNTED");
    clearInterval(this.intervalId);
  }

  capture = (ele, canvas) => {
    domtoimage
      .toPng(ele)
      .then(function(dataUrl) {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          if (!canvas) return;
          canvas.width = img.width;
          canvas.height = img.height;
          const context = canvas.getContext("2d");
          context.drawImage(img, 0, 0);
        };
      })
      .catch(function(error) {
        console.error("oops, something went wrong!", error);
      });
  };

  onLoad = () => {
    const spotifyMiniWindow = document.getElementById(ID.WINDOW.SPOTIFY);
    const canvas = document.createElement("canvas");
    canvas.id = ID.CANVAS.SPOTIFY;
    const video = document.createElement("video");
    video.id = ID.VIDEO.SPOTIFY;
    spotifyMiniWindow.appendChild(canvas);
    spotifyMiniWindow.appendChild(video);
    video.srcObject = canvas.captureStream();
    video.play();
    const ele = document.getElementById(ID.FRAME.SPOTIFY);
    this.intervalId = setInterval(() => {
      this.capture(ele, canvas);
    }, 1000);
  };

  render() {
    const { store } = this.props;
    const song = store[STORE_VAR.SONG];

    return <WindowView song={song} ratio="70" onLoad={this.onLoad} />;
  }
}

export default createSpotifyWindow;
