import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import domtoimage from "dom-to-image";
import $ from "jquery";

import WindowView from "./view";

const createSpotifyWindow = () => {
  let spotifyMiniWindow = document.getElementById("spotify-window-id");
  if (spotifyMiniWindow) return;
  spotifyMiniWindow = document.createElement("div");
  spotifyMiniWindow.id = "spotify-window-id";
  document.body.appendChild(spotifyMiniWindow);
  ReactDOM.render(<Window />, spotifyMiniWindow);
};

class Window extends React.Component {
  capture = () => {
    const ele = document.getElementById("box-432");
    domtoimage
      .toPng(ele)
      .then(function(dataUrl) {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          let canvas = document.getElementById("canvas-432");
          if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.id = "canvas-432";
            canvas.width = img.width;
            canvas.height = img.height;
            document.body.appendChild(canvas);
            const video = document.createElement("video");
            video.id = "video-432";
            document.body.appendChild(video);
            // const video = document.getElementById("video-432");
            video.srcObject = canvas.captureStream();
            video.play();
          }
          const context = canvas.getContext("2d");
          context.drawImage(img, 0, 0);
        };
      })
      .catch(function(error) {
        console.error("oops, something went wrong!", error);
      });
  };

  onLoad = () => {
    setInterval(() => {
      this.capture();
    }, 1000);
  };

  render() {
    return <WindowView ratio="70" onLoad={this.onLoad} />;
  }
}

export default createSpotifyWindow;
