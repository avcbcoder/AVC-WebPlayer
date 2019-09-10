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
    // extensionBody.style.overflow = "hidden";
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

const onSongChange = () => {};

class Window extends React.Component {
  constructor(props) {
    super(props);
    this.intervalId = "";
    this.count = 0;
  }

  componentWillUnmount() {
    console.log("UNMOUNTED");
    clearInterval(this.intervalId);
  }

  capture = () => {
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
            canvas = document.createElement("canvas");
            canvas.id = ID.CANVAS.SPOTIFY;
            canvas.width = img.width;
            canvas.height = img.height;
            document.body.appendChild(canvas);
            // draw image on canvas
            const context = canvas.getContext("2d");
            context.drawImage(img, 0, 0);
            // create video element
            video = document.createElement("video");
            video.id = ID.VIDEO.SPOTIFY;
            document.body.appendChild(video);
            video.srcObject = canvas.captureStream();
            video.play();
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
  };

  onLoad = () => {
    this.intervalId = setInterval(() => {
      if (this.count === 10) {
        clearInterval(this.intervalId);
        return;
      }
      this.count++;
      this.capture();
    }, 100);
  };

  render() {
    const { store } = this.props;
    const song = store[STORE_VAR.SONG];

    return <WindowView song={song} ratio="20" onLoad={this.onLoad} />;
  }
}

export default createSpotifyWindow;
