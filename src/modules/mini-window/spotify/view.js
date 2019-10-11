import React from "react";
import styled, { css, keyframes } from "styled-components";
import { ID, GRAPHICS } from "../../../constants";
import { COLOR } from "../../../constants/color";
import { Separator } from "../../../components";

const WindowWrapper = styled.div`
  width: ${({ w }) => w}px;
  height: ${({ h }) => h}px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const Body = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Background = styled.img`
  width: ${({ w }) => w}px;
  height: ${({ h }) => h}px;
  /* position: absolute;
  top: 0;
  left: 0; */
  z-index: -5;
`;

const Bottom = styled.div`
  /* position: absolute;
  bottom: 0;
  left: 0; */
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
  font-family:Comic Sans MS;
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
    // if graphics is high , ratio =60, on medium = ratio = 30, in low = only thumbnails are loaded
    const graphics = GRAPHICS.HIGH;
    const ratio = graphics === GRAPHICS.HIGH ? 60 : 30,
      { song, onLoad } = this.props,
      { image, imageUpdated } = this.state;

    const { title, artist } = song,
      width = ratio * 16,
      height = ratio * 9,
      labelHeight = Math.floor((height * 24) / 100);
    let ctt = 0;
    if (imageUpdated) {
      ctt = new Date().getTime();
      console.log("image is set to load ---------------------");
    }
    return (
      <WindowWrapper w={width} h={height + labelHeight}>
        <Body id={ID.FRAME.SPOTIFY}>
          <Background
            id="img-432"
            w={width}
            h={height}
            alt=""
            src={image}
            onLoad={
              imageUpdated
                ? () => {
                    console.log(
                      "VIEW image loaded",
                      " time diff=",
                      new Date().getTime() - ctt
                    );
                    onLoad();
                  }
                : () => {}
            }
          ></Background>
          <Bottom h={labelHeight}>
            <Text fontSize={graphics === GRAPHICS.HIGH ? 42:24}>
              {title.length > 20 ? title.substr(0, 20) : title}
            </Text>
            <Separator height="12" />
            {/* <br /> */}
            <Text fontSize={graphics === GRAPHICS.HIGH ? 32:18}>
              {artist[0].length > 20 ? artist[0].substr(0, 20) : artist[0]}
            </Text>
          </Bottom>
        </Body>
      </WindowWrapper>
    );
  }
}
