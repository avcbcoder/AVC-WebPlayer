import React from "react";
import styled from "styled-components";
import domtoimage from "dom-to-image";
import $ from "jquery";

const Wrap = styled.div`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  position: fixed;
  top: 0;
  left: 0;
`;

const Box = styled.div`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  position: fixed;
  top: 0;
  left: 0;
`;

const Video = styled.video`
  position: fixed;
  bottom: ${({ height }) => -2 * height}px;
  left: ${({ width }) => -2 * width}px;
`;

export default class WindowView extends React.Component {
  componentDidMount() {
    const { onLoad } = this.props;
    const img = document.getElementById("img-432");
    img.onload = () => {
      onLoad();
    };
  }

  render() {
    const { ratio } = this.props;
    const width = ratio * 16;
    const height = ratio * 9;
    return (
      <Box id="box-432" width={width} height={height}>
        <img
          id="img-432"
          width={width + "px"}
          height={height + "px"}
          alt=""
          src="https://images7.alphacoders.com/905/905837.jpg"
        />
      </Box>
    );
  }
}

//     {/*<Wrap>*/}

//     {/* <Video
//       id="spotify-video-432"
//       controls="controls"
//       autoplay
//       width={width}
//       height={height}
//     ></Video> */}
//   {/* </Wrap> */}
