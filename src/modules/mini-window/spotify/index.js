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
          if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.id =ID.CANVAS.SPOTIFY;
            canvas.width = img.width;
            canvas.height = img.height;
            document.body.appendChild(canvas);
            const video = document.createElement("video");
            video.id = ID.VIDEO.SPOTIFY;
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

  onLoad2 = () => {
    const spotifyMiniWindow = document.getElementById(ID.WINDOW.SPOTIFY);
    const ele = document.getElementById(ID.FRAME.SPOTIFY);
    this.count = 0;
    this.intervalId = setInterval(() => {
      domtoimage
        .toPng(ele)
        .then(dataUrl => {
          const img = new Image();
          img.src = dataUrl;
          img.onload = () => {
            let canvas = document.getElementById(ID.CANVAS.SPOTIFY);
            let video = document.getElementById(ID.VIDEO.SPOTIFY);
            switch (this.count) {
              case 0:
                console.log("IN CASE ", 0);
                if (!canvas) {
                  canvas = document.createElement("canvas");
                  canvas.id = ID.CANVAS.SPOTIFY;
                  canvas.width = img.width;
                  canvas.height = img.height;
                  const context = canvas.getContext("2d");
                  context.drawImage(img, 0, 0);
                  spotifyMiniWindow.appendChild(canvas);
                }
                break;
              case 1:
                console.log("IN CASE ", 1);
              case 2:
                console.log("IN CASE ", 2);
                canvas.width = img.width;
                canvas.height = img.height;
                const context = canvas.getContext("2d");
                context.drawImage(img, 0, 0);
                break;
              case 3:
                console.log("IN CASE ", 3);
                if (!video) {
                  video = document.createElement("video");
                  video.id = ID.VIDEO.SPOTIFY;
                  video.srcObject = canvas.captureStream();
                  spotifyMiniWindow.appendChild(video);
                }
                break;
              case 4:
                console.log("IN CASE ", 4);
                video.play();
                break;
              default:
                console.log("IN CASE ", 5);
                clearInterval(this.intervalId);
                break;
            }
            this.count++;
          };
        })
        .catch(function(error) {
          console.error("oops, something went wrong!", error);
        });
    }, 1000);
  };

  render() {
    const { store } = this.props;
    const song = store[STORE_VAR.SONG];

    return <WindowView song={song} ratio="20" onLoad={this.onLoad} />;
  }
}

export default createSpotifyWindow;
