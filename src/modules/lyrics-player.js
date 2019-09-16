/*global chrome */
import React from "react";

import styled, { css, keyframes } from "styled-components";
import { Col, Separator, Img, CenterHV } from "../components";
import { getAllIcons } from "../constants/icon";
import { COLOR } from "../constants/color";
import {
  STORE_VAR,
  HAPPI_OBJ,
  API_STATE,
  DEFAULT_LYRICS,
  ID
} from "../constants";
import domtoimage from "dom-to-image";

const { minimizeWhiteIcon, closeWhiteThinIcon } = getAllIcons(chrome);

const scroll = y => keyframes`
  0% {
    top: 8em;
  }
  100% {
    top: -${y}em;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: transparent;
  text-align: center;
  background: ${COLOR.LIGHT_BLACK};
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
`;

const ButtonCollection = styled.div`
  width: 100%;
  padding-right: 8px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const Text = styled.div`
  color: ${COLOR.WHITE_LYRICS};
`;

const LyricsBox = styled.div`
  border: "5px solid white";
  text-align: center;
  width: 90%;
  height: 70%;
  font-size: 14px;
  line-height: 1.3em;
  position: relative;
  box-sizing: border-box;
`;

const TopGradient = styled.div`
  width: 100%;
  height: 20px;
  background-image: linear-gradient(
    180deg,
    ${COLOR.LIGHT_BLACK},
    rgba(30, 30, 30, 0)
  );
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9999999;
`;

const BottomGradient = styled.div`
  width: 100%;
  height: 20px;
  background-image: linear-gradient(
    180deg,
    rgba(30, 30, 30, 0),
    ${COLOR.LIGHT_BLACK}
  );
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 9999999;
`;

const MarqueeWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Marquee = styled.p`
    top: 6em;
    position: relative;
    box-sizing: border-box;
    animation: ${({ y }) => scroll(y)} ${({ time }) => time}s linear infinite;
    /* animation: ${({ y }) => scroll(y)} 20s linear infinite; */
    &:hover{
        animation-play-state: paused;
    }
`;

class LyricsPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.refBox = React.createRef();
  }

  replace = (str, a, b) => {
    //Method 1
    return str.split(a).join(b);
    //Method 2 - using regular expression
  };

  getY = (y, arr) => {
    arr.forEach((str, idx) => {
      y += str.length >= 50 ? 2 : 1;
    });
    return y;
  };

  getScrollableLyrics = () => {
    const { store } = this.props,
      { totalTime } = store[STORE_VAR.SONG],
      { response: happiResponse } = store[STORE_VAR.HAPPI],
      { state: azState, response: azResponse } = store[STORE_VAR.LYRICS];
    let lyrics = happiResponse[HAPPI_OBJ.LYRICS],
      y = 53,
      lyricsArr = [];

    if (!lyrics && azState === API_STATE.SUCCESS) lyrics = azResponse;

    lyricsArr = this.replace(
      lyrics ? lyrics : DEFAULT_LYRICS,
      `\n\n`,
      `\n \n`
    ).split("\n");
    y = lyrics
      ? lyrics.split(`\n\n`).length
      : DEFAULT_LYRICS.split(`\n\n`).length;

    if (lyrics)
      return (
        <Marquee y={this.getY(y, lyricsArr)} time={totalTime}>
          {lyricsArr.map(lyric => (
            <Text>{lyric === " " ? <br /> : lyric}</Text>
          ))}
        </Marquee>
      );
    if (azState === API_STATE.FAIL)
      return <Text>Lyrics not found for this song</Text>;
    if (azState === API_STATE.FETCHING)
      return <Text>Fetching lyrics for this song</Text>;
  };

  startMiniWindow = () => {
    const v = document.getElementById(ID.VIDEO.SPOTIFY);
    if (v) v.requestPictureInPicture();
  };

  render() {
    const { onClose } = this.props;

    return (
      <Wrapper ref={this.refBox}>
        <Separator height="12" />
        <ButtonCollection>
          <Img
            w="15"
            h="15"
            src={minimizeWhiteIcon}
            onClick={this.startMiniWindow}
          ></Img>
          <Separator width="16" />
          <Img w="15" h="15" src={closeWhiteThinIcon} onClick={onClose}></Img>
          <Separator width="16" />
        </ButtonCollection>
        <Separator height="14" />
        <LyricsBox>
          <TopGradient />
          <MarqueeWrapper>{this.getScrollableLyrics()}</MarqueeWrapper>
          <BottomGradient />
        </LyricsBox>
      </Wrapper>
    );
  }
}

export default LyricsPlayer;
