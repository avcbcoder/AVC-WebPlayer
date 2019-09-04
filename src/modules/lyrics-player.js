/*global chrome */
import React from "react";
import { MODE, ID, DEFAULT_LYRICS } from "../constants/index";

import styled, { css, keyframes } from "styled-components";
import { Col, Separator, Img, CenterHV } from "../components";
import { getAllIcons } from "../constants/icon";
import { COLOR } from "../constants/color";
import { STORE_VAR, HAPPI_OBJ } from "../constants";

const { minimizeIcon, closeWhiteThinIcon } = getAllIcons(chrome);

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
    this.state = {
      lyricsState: "Lyrics will appear here",
      lyrics: "",
      progressTime: "",
      totalTime: ""
    };
    this.refLyricsBox = React.createRef();
  }

  static getDerivedStateFromProps({ store }) {
    return {};
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

  componentDidMount() {}

  render() {
    const { store, onClose } = this.props;
    const lyrics = store[STORE_VAR.LYRICS];
    const { progressTime, totalTime } = store[STORE_VAR.SONG];
    const { state, response } = store[STORE_VAR.HAPPI];
    let happiLyrics = "";
    if (state === "success") happiLyrics = response[HAPPI_OBJ.LYRICS];

    let lyric = happiLyrics;
    let y = 53;
    let lyricsArr = [];
    if (!lyric && lyrics.state === "success") lyric = lyrics.data;

    lyricsArr = this.replace(
      lyric ? lyric : DEFAULT_LYRICS,
      `\n\n`,
      `\n \n`
    ).split("\n");
    y = lyric
      ? lyric.split(`\n\n`).length
      : DEFAULT_LYRICS.split(`\n\n`).length;
    // const scrollPos = Math.floor(((y / totalTime) * progressTime))

    return (
      <Wrapper>
        <Separator height="12" />
        <ButtonCollection>
          <Img
            w="15"
            h="15"
            src={minimizeIcon}
            onClick={() => onClose()}
            style={{ cursor: "pointer" }}
          ></Img>
          <Separator width="16" />
          <Img
            w="15"
            h="15"
            src={closeWhiteThinIcon}
            style={{ cursor: "pointer" }}
          ></Img>
          <Separator width="16" />
        </ButtonCollection>
        <Separator height="14" />
        <LyricsBox>
          <TopGradient />
          <MarqueeWrapper>
            {lyrics.state === "fail" && (
              <Text>Lyrics not found for this song</Text>
            )}
            {lyrics.state === "fetching" && (
              <Text>Fetching lyrics for this song</Text>
            )}
            {lyrics.state === "success" && (
              <Marquee
                ref={this.refLyricsBox}
                y={this.getY(y, lyricsArr)}
                time={
                  60 * parseInt(totalTime.split(":")[0], 10) +
                  parseInt(totalTime.split(":")[1], 10)
                }
              >
                {lyricsArr.map(lyric => (
                  <Text>{lyric === " " ? <br /> : lyric}</Text>
                ))}
              </Marquee>
            )}
          </MarqueeWrapper>
          <BottomGradient />
        </LyricsBox>
      </Wrapper>
    );
  }
}

export default LyricsPlayer;
