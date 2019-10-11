import React from "react";
import styled, { css, keyframes } from "styled-components";
import { ID, GRAPHICS } from "../../../constants";
import { COLOR } from "../../../constants/color";
import { Separator } from "../../../components";

const WindowWrapper = styled.div`
  width: ${({ w }) => w}px;
  height: ${({ h }) => h}px;
  /* position: fixed;
  top: 0px;
  left: 0px;
  z-index: 1000;
  border:5px solid red; */
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
`;
const AlbumCoverPort = styled.div`
  width: ${({ w }) => w}px;
  height: ${({ h }) => h}px;
  position: relative;
`;

const AlbumCoverImage = styled.img`
  width: ${({ w }) => w}px;
  height: ${({ h }) => h}px;
  position: absolute;
  top: ${({ t }) => t}px;
  left: ${({ l }) => l}px;
  z-index: -5;
`;

const Bottom = styled.div`
  width: 100%;
  height: ${({ h }) => h}px;
  background-color: ${COLOR.LIGHT_BLACK};
  display: flex;
  flex-direction: column;
  z-index: 5;
  align-items: center;
  justify-content: center;
`;

const Text = styled.div`
  width: 100%;
  text-align: center;
  color: ${COLOR.WHITE_LYRICS};
  font-size: ${({ fontSize }) => fontSize}px;
  padding-left: 4px;
  padding-right: 4px;
  font-family: Comic Sans MS;
`;

const graphicsSettings = GRAPHICS.HIGH;

export default class WindowView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      imageUpdated: "",
      imageUrl: "",
      dimesnions: {},
      ratio: graphicsSettings === GRAPHICS.HIGH ? 60 : 30
    };
  }

  static getNewDimension(ratio, image) {
    console.log(567, "getting new dimension", image);
    const imagePortWidth = ratio * 16,
      imagePortHeight = ratio * 9,
      labelWidth = imagePortWidth,
      labelHeight = Math.floor((imagePortHeight * 24) / 100),
      canvasWidth = imagePortWidth,
      canvasHeight = imagePortHeight + labelHeight,
      trackFontSize = graphicsSettings === GRAPHICS.HIGH ? 42 : 24,
      artistFontSize = graphicsSettings === GRAPHICS.HIGH ? 36 : 18;

    let imageWidth = imagePortWidth,
      imageHeight = imagePortHeight,
      top = 0,
      left = 0;

    if (image && image.width && image.height) {
      const w = image.width,
        h = image.height,
        r = (w * 1.0) / (h * 1.0);

      //   if (Math.ceil(imagePortWidth / r) >= imagePortHeight) {
      imageWidth = imagePortWidth;
      imageHeight = Math.ceil(imagePortWidth / r);
      //   } else {
      //     imageHeight = imagePortHeight;
      //     imageWidth = Math.ceil(r * imagePortHeight);
      //   }

    //   top = -Math.abs(imagePortWidth - imageWidth) / 2;
    //   left = -Math.abs(imagePortHeight - imageHeight) / 2;
    }

    return {
      imagePortWidth,
      imagePortHeight,
      labelWidth,
      labelHeight,
      canvasWidth,
      canvasHeight,
      imageWidth,
      imageHeight,
      top,
      left,
      trackFontSize,
      artistFontSize
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { imageUrl, image } = props;
    const { ratio } = state;
    const newDim = WindowView.getNewDimension(ratio, image);
    console.log(567, "props in optimized view", props, newDim);
    return {
      image,
      imageUpdated: props.imageUrl !== state.imageUrl,
      imageUrl,
      dimesnions: newDim
    };
  }

  componentDidUpdate() {
    const { onLoad } = this.props;
    const { imageUpdated } = this.state;
    if (!imageUpdated) onLoad();
  }

  render() {
    const { song, onLoad } = this.props;
    const { title, artist } = song;
    const { imageUrl, imageUpdated, dimesnions } = this.state;
    const {
      imagePortWidth,
      imagePortHeight,
      labelWidth,
      labelHeight,
      canvasWidth,
      canvasHeight,
      imageWidth,
      imageHeight,
      top,
      left,
      trackFontSize,
      artistFontSize
    } = dimesnions;

    return (
      <WindowWrapper w={canvasWidth} h={canvasHeight}>
        <Body id={ID.FRAME.SPOTIFY}>
          <AlbumCoverPort w={imagePortWidth} h={imagePortHeight}>
            <AlbumCoverImage
              id="img-432"
              w={imageWidth}
              h={imageHeight}
              t={top}
              l={left}
              alt=""
              src={imageUrl}
              onLoad={imageUpdated ? onLoad : () => {}}
            ></AlbumCoverImage>
          </AlbumCoverPort>
          <Bottom h={labelHeight}>
            <Text fontSize={trackFontSize}>
              {title.length > 20 ? title.substr(0, 20) : title}
            </Text>
            <Separator height="9" />
            <Text fontSize={artistFontSize}>
              {artist[0].length > 20 ? artist[0].substr(0, 20) : artist[0]}
            </Text>
          </Bottom>
        </Body>
      </WindowWrapper>
    );
  }
}
