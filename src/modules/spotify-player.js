/*global chrome */
import React from "react";
import PropTypes from "prop-types";
import { MODE, ID, CONTROLS } from "../constants/index";
import { CenterHV, Col, Separator, Img } from "../components";

import styled from "styled-components";
import "react-circular-progressbar/dist/styles.css";
import "../css/circular-progress.css";
import {
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";
import { THEME } from "../constants/color";
import { getAllIcons } from "../constants/icon";
import { STORE_VAR, HAPPI_OBJ } from "../constants";
import CircularProgress from "./circular-progress-bar";
import {
  changeMedia,
  startYoutubeMiniMode
} from "../extension-background/sender";

const {
  playIcon,
  prevIcon,
  nextIcon,
  gifPause1,
  gifPause2,
  shuffleIcon,
  gifPlay,
  repeatIcon,
  menuIcon,
  closeIcon,
  pauseIcon,
  menuWhiteIcon,
  closeWhiteIcon,
  minimizeBlueIcon1,
  minimizeBlueIcon2,
  settingIcon1,
  settingIcon2,
  youtubeIcon1,
  youtubeIcon2
} = getAllIcons(chrome);

const STYLE = {
  ALBUM_ART_DIMENSION: 120
};

const Wrapper = styled.div`
  width: 100%;
  height: 74vh;
  background: #fff;
  overflow: hidden;
  position: relative;
`;

const Upper = styled.div`
  width: 100%;
  height: 36vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const Bottom = styled.div`
  width: 100%;
  height: 38vh;
  display: flex;
  flex-direction: column;
`;

const Background = styled.div`
  background: #ed9092;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const Control = styled.div`
  margin-top: -4px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const PlaylistControlRepeat = styled.div`
  cursor: pointer;
  position: absolute;
  bottom: -28px;
  right: -28px;
`;

const PlaylistControlShuffle = styled.div`
  cursor: pointer;
  position: absolute;
  bottom: -28px;
  left: -28px;
`;

const AlbumArtImage = styled.div`
  margin-top: 50px;
`;

const Gif = styled.img`
  width: 100%;
  height: 80px;
`;

const PlayPauseButton = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #fff;
  padding: 5px;
  box-shadow: 0px 8px 16px #6b5f5f;
  margin-left: 30px;
  margin-right: 30px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const NextButton = styled.div`
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.1);
  }
`;

const PrevButton = styled.div`
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.1);
  }
`;

const Details = styled.div`
  text-align: center;
  color: #fff;
  padding-left: 10px;
  padding-right: 10px;
`;

const Track = styled.div`
  font-size: 20px;
  text-shadow: 2px 2px 3px #fff;
  overflow: hidden;
  white-space: nowrap;
`;

const Artist = styled.div`
  font-weight: 700;
`;

const ImgR = styled(Img)`
  position: absolute;
  top: 8px;
  left: 8px;
`;

const ImgS = styled(Img)`
  position: absolute;
  top: 8px;
  right: 8px;
`;

const Menu = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.1);
  }
  z-index: 100;
`;

const Close = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.1);
  }
  z-index: 100;
`;

const Mini = styled.div`
  position: absolute;
  top: 16px;
  right: 44px;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.1);
  }
  z-index: 100;
`;

const Youtube = styled.div`
  position: absolute;
  top: 16px;
  right: 72px;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.1);
  }
  z-index: 100;
`;

const Pie = styled.div`
  border-radius: 50%;
  background: #fff;
  width: 60px;
  height: 60px;
  position: relative;
`;

const HoverMenu = styled.div`
  position: absolute;
  background: ${THEME.PLAYER_BLUE};
  height: 100%;
  width: 100%;
  z-index: 50;
  clip-path: circle(10px at -90% -10%);
  -webkit-clip-path: circle(10px at -90% -10%);
  transition: all 1s ease-out;
`;

const PlayPauseIcon = styled(Img)`
  margin-left: ${({ playing }) => (playing ? 4 : 0)}px;
`;

class SpotifyPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.refMenuHover = React.createRef();
    this.refMenuIcon = React.createRef();
    this.refCloseIcon = React.createRef();
    this.isMenuOpen = false;
  }

  static getDerivedStateFromProps() {
    return {};
  }

  getProgress = (progressTime, totalTime) => {
    if (!progressTime || !totalTime) return 1;
    return Math.floor((progressTime / totalTime) * 100);
  };

  trim = str => {
    return str.length > 22 ? str.substr(0, 25) + "..." : str;
  };

  toggleMenu = () => {
    if (!this.isMenuOpen) {
      this.refMenuHover.current.style.clipPath = "circle(1000px at -90% -10%)";
      this.refMenuHover.current.style.webkitClipPath =
        "circle(1000px at -90% -10%)";
      this.refMenuIcon.current.src = menuWhiteIcon;
      this.refCloseIcon.current.src = closeWhiteIcon;
      this.refMenuHover.current.style.pointerEvents = "none";
      this.isMenuOpen = true;
    } else {
      this.refMenuHover.current.style.clipPath = "circle(10px at -90% -10%)";
      this.refMenuHover.current.style.webkitClipPath =
        "circle(10px at -90% -10%)";
      this.refMenuIcon.current.src = menuIcon;
      this.refCloseIcon.current.src = closeIcon;
      this.refMenuHover.current.style.pointerEvents = "all";
      this.isMenuOpen = false;
    }
  };

  startMiniWindow = () => {
    const v = document.getElementById(ID.VIDEO.SPOTIFY);
    if (v) v.requestPictureInPicture();
  };

  render() {
    const { store, onClose } = this.props;
    const {
      title,
      artist,
      albumArt,
      totalTime,
      progressTime,
      playing,
      time
    } = store[STORE_VAR.SONG];
    const { state, response } = store[STORE_VAR.HAPPI];

    let cover = "";
    if (state === "success") cover = response[HAPPI_OBJ.COVER];

    return (
      <Wrapper>
        <HoverMenu ref={this.refMenuHover}></HoverMenu>
        <Menu onClick={this.toggleMenu}>
          <Img ref={this.refMenuIcon} src={menuIcon} w={20} h={20}></Img>
        </Menu>
        <Close onClick={onClose}>
          <Img ref={this.refCloseIcon} src={closeIcon} w={20} h={20}></Img>
        </Close>
        <Mini onClick={this.startMiniWindow}>
          <Img src={minimizeBlueIcon1} w={20} h={20}></Img>
        </Mini>
        <Youtube
          onClick={() => {
            if (playing) changeMedia(CONTROLS.PLAY);
            startYoutubeMiniMode(store[STORE_VAR.SONG]);
          }}
        >
          <Img src={youtubeIcon1} w={20} h={20}></Img>
        </Youtube>
        <Upper>
          <AlbumArtImage>
            <CircularProgress
              playing={playing}
              albumArt={cover ? cover : albumArt}
              progressTime={progressTime}
              totalTime={totalTime}
              timeStamp={new Date().getTime()}
              time={time}
            />
          </AlbumArtImage>
        </Upper>
        <Bottom>
          <Gif
            src={
              playing
                ? gifPlay
                : Math.floor(Math.random() * 100) % 2 === 0
                ? gifPause1
                : gifPause2
            }
          ></Gif>
          <Background>
            <Details>
              <Track>{this.trim(title)}</Track>
              <Separator h="12"></Separator>
              <Artist>{this.trim(artist.join(`, `))}</Artist>
            </Details>
            <Control>
              <PrevButton>
                <Img
                  src={prevIcon}
                  w={30}
                  h={30}
                  onClick={() => {
                    changeMedia(CONTROLS.PREV);
                  }}
                ></Img>
              </PrevButton>
              <PlayPauseButton>
                <PlayPauseIcon
                  src={playing ? playIcon : pauseIcon}
                  w={24}
                  h={24}
                  onClick={() => {
                    changeMedia(CONTROLS.PLAY);
                  }}
                ></PlayPauseIcon>
              </PlayPauseButton>
              <NextButton>
                <Img
                  src={nextIcon}
                  w={30}
                  h={30}
                  onClick={() => {
                    changeMedia(CONTROLS.NEXT);
                  }}
                ></Img>
              </NextButton>
            </Control>
          </Background>
        </Bottom>
        <PlaylistControlShuffle>
          <Pie>
            <ImgS
              src={shuffleIcon}
              w={20}
              h={20}
              onClick={() => {
                changeMedia(CONTROLS.SHUFFLE);
              }}
            ></ImgS>
          </Pie>
        </PlaylistControlShuffle>
        <PlaylistControlRepeat>
          <Pie>
            <ImgR
              src={repeatIcon}
              w={20}
              h={20}
              onClick={() => {
                changeMedia(CONTROLS.REPEAT);
              }}
            ></ImgR>
          </Pie>
        </PlaylistControlRepeat>
      </Wrapper>
    );
  }
}

export default SpotifyPlayer;
