import React from "react";
import styled, { css, keyframes } from "styled-components";
import { ID } from "../../../constants";

const progressAnimation = (initialWidth, finalWidth) => keyframes`
  from{
    width:${initialWidth}px;
  }
  to{
    width:${finalWidth}px;
  }
`;

const WindowWrapper = styled.div`
  width: ${({ w }) => w}px;
  height: ${({ h }) => h}px;
  position: fixed;
  top: 0;
  left: 0;
`;

const Body = styled.div`
  width: ${({ w }) => w}px;
  height: ${({ h }) => h}px;
  position: relative;
`;

const Background = styled.img`
  width: ${({ w }) => w}px;
  height: ${({ h }) => h}px;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: -5;
`;

const Bottom = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 20px;
  background-color: black;
  display: flex;
  flex-direction: column;
  z-index: 5;
`;

const ProgressBar = styled.div`
  background-color: "rgb(30,30,30,1)";
  height: 5px;
`;

const Progress = styled.div`
  background-color: #fff;
  height: 5px;
  width: ${({ initialWidth }) => initialWidth}px;
  ${({ playing }) =>
    playing &&
    css`
      animation: ${({ initialWidth, finalWidth }) =>
          progressAnimation(initialWidth, finalWidth)}
        ${({ time }) => time}s linear;
    `}
`;

const Text = styled.p`
  color: #fff;
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
    const { ratio, song, images } = this.props;
    const { title, artist, playing, progressTime, totalTime } = song;
    const width = ratio * 16;
    const height = ratio * 9;
    const widthInOneSec = width / totalTime;
    const initialWidth = widthInOneSec * progressTime;
    const time = totalTime - progressTime;
    // initial width final width playing time
    return (
      <WindowWrapper w={width} h={height}>
        <Body w={width} h={height} id={ID.FRAME.SPOTIFY}>
          <Background
            id="img-432"
            w={width}
            h={height}
            alt=""
            src="https://images7.alphacoders.com/905/905837.jpg"
          ></Background>
          <Bottom>
            <ProgressBar>
              <Progress
                initialWidth={initialWidth}
                finalWidth={width}
                time={time}
                playing={playing}
              ></Progress>
            </ProgressBar>
            <Text>{`${artist[0]} : ${title}`}</Text>
          </Bottom>
        </Body>
      </WindowWrapper>
    );
  }
}
