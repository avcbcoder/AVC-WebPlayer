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
  z-index: 1000;
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
  top: 0;
  left: 0;
  z-index: -5;
`;

const Bottom = styled.div`
  position: absolute;
  bottom: 0;
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

const Text = styled.div`
  color: #fff;
`;

export default class WindowView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { image: "", imageUpdated: "" };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.image !== state.image)
      return { image: props.image, imageUpdated: true };
    else return { imageUpdated: false };
  }

  componentDidUpdate() {
    const { onLoad } = this.props;
    const { imageUpdated } = this.state;
    if (!imageUpdated) onLoad();
  }

  render() {
    const ratio = 70,
      { song, onLoad } = this.props,
      { image, imageUpdated } = this.state;
    const { title, artist } = song,
      width = ratio * 16,
      height = ratio * 9;

    return (
      <WindowWrapper w={width} h={height}>
        <Body w={width} h={height} id={ID.FRAME.SPOTIFY}>
          <Background
            id="img-432"
            w={width}
            h={height}
            alt=""
            src={image}
            onLoad={imageUpdated ? onLoad : () => {}}
          ></Background>
          <Bottom>
            <Text>{`${artist[0]} : ${title}`}</Text>
          </Bottom>
        </Body>
      </WindowWrapper>
    );
  }
}
