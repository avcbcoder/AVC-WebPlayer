import React from "react";
import styled from "styled-components";
import domtoimage from "dom-to-image";
import $ from "jquery";

const Wrap = styled.div`
  width: 400px;
  height: 300px;
  border: 1px solid red;
`;

const Box = styled.div`
  width: 200px;
  height: 100px;
  border: 5px solid black;
`;

const Video = styled.video`
  position: fixed;
  bottom: 0;
  left: 0;
`;

class R2C extends React.Component {
  capture = () => {
    const ele = document.getElementById("box432");
    domtoimage
      .toPng(ele)
      .then(function(dataUrl) {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          let canvas = document.getElementById("canvas432");
          if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.id = "canvas432";
            canvas.width = img.width;
            canvas.height = img.height;
            document.body.appendChild(canvas);
            const video = document.getElementById("video432");
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

  getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  componentDidMount() {
    setInterval(() => {
    //   const p = document.getElementById("p432");
    //   const box = document.getElementById("box432");
    //   p.innerText = Math.random();
    //   box.style.backgroundColor = this.getRandomColor();
      this.capture();
    }, 1000);
  }

  onClick = () => {
    const v = document.getElementsByTagName("video")[0];
    console.log(v);
    v.requestPictureInPicture();
  };

  render() {
    return (
      <Wrap id="wrap432">
        <h1>Head</h1>
        <Box id="box432">
          {/* <p id="p432" /> */}
          <img
            id="img432"
            width="200px"
            height="100px"
            src="https://images7.alphacoders.com/905/905837.jpg"
          />
        </Box>
        <br />
        <button onClick={this.onClick}>capture</button>
        <br />
        <Video id="video432" controls="controls" autoplay></Video>
      </Wrap>
    );
  }
}

export default R2C;
