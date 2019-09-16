/*global chrome*/

import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import $ from "jquery";
import { MODE, API_STATE, STORE_VAR, HAPPI_OBJ } from "./constants";

import styled from "styled-components";
import SpotifyPlayer from "./modules/spotify-player";
import LyricsPlayer from "./modules/lyrics-player";
import R2C from "./modules/picture-in-picture/render-to-canvas";
import MenuCollection from "./modules/menu-collection";

import { YOUTUBE_PLAYER, SPOTIFY_PLAYER } from "./constants/dimension";
import { DISPLAY_MODE } from "./constants/index";
// import YoutubePlayer from "./modules/youtube-player";
import YoutubePlayer from "./modules/player/youtube";
import { getAllIcons } from "./constants/icon";


import {
  getHappiData,
  getLyrics,
  getVideoId
} from "./extension-background/sender";

const { ytBkg1 } = getAllIcons(chrome);

const Root = styled.div`
  width: ${(SPOTIFY_PLAYER.WIDTH * window.screen.availWidth) / 100}px;
  height: 100vh;
  z-index: 9000101;
`;

const MenuWrapper = styled.div`
  width: ${(SPOTIFY_PLAYER.WIDTH * window.screen.availWidth) / 100}px;
  position: fixed;
  right: 30px;
  top: 10px;
  overflow: hidden;
  z-index: 5000;
  -webkit-box-shadow: 0px 0px 8px 2px rgba(163, 145, 163, 1);
  -moz-box-shadow: 0px 0px 8px 2px rgba(163, 145, 163, 1);
  box-shadow: 0px 0px 8px 2px rgba(163, 145, 163, 1);
  border-radius: 2px;
`;

const WrapperSpotify = styled.div`
  width: ${(SPOTIFY_PLAYER.WIDTH * window.screen.availWidth) / 100}px;
  height: ${SPOTIFY_PLAYER.HEIGHT}vh;
  position: fixed;
  right: 30px;
  top: 70px;
  overflow: hidden;
  -webkit-box-shadow: 0px 0px 8px 2px rgba(163, 145, 163, 1);
  -moz-box-shadow: 0px 0px 8px 2px rgba(163, 145, 163, 1);
  box-shadow: 0px 0px 8px 2px rgba(163, 145, 163, 1);
  z-index: 5000;
  border-radius: 2px;
`;

const WrapperYoutube = styled.div`
  width: ${(YOUTUBE_PLAYER.WIDTH * window.screen.availWidth) / 100}px;
  height: ${Math.floor(
    (Math.floor((window.screen.availWidth * YOUTUBE_PLAYER.WIDTH) / 100) *
      10.9) /
      16
  )}px;
  position: fixed;
  right: 30px;
  top: 70px;
  overflow: hidden;
  -webkit-box-shadow: 0px 0px 8px 2px rgba(163, 145, 163, 1);
  -moz-box-shadow: 0px 0px 8px 2px rgba(163, 145, 163, 1);
  box-shadow: 0px 0px 8px 2px rgba(163, 145, 163, 1);
  z-index: 5000;
  border-radius: 2px;
  background: url(${ytBkg1});
  background-size: cover;
`;

const WrapperLyrics = styled.div`
  width: ${(YOUTUBE_PLAYER.WIDTH * window.screen.availWidth) / 100}px;
  height: ${Math.floor(
    (Math.floor((window.screen.availWidth * YOUTUBE_PLAYER.WIDTH) / 100) *
      10.9) /
      16
  )}px;
  position: fixed;
  right: 30px;
  top: 70px;
  overflow: hidden;
  -webkit-box-shadow: 0px 0px 8px 2px rgba(163, 145, 163, 1);
  -moz-box-shadow: 0px 0px 8px 2px rgba(163, 145, 163, 1);
  box-shadow: 0px 0px 8px 2px rgba(163, 145, 163, 1);
  z-index: 5000;
  border-radius: 2px;
  background-size: cover;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: DISPLAY_MODE.SPOTIFY
    };
  }

  static getDerivedStateFromProps({ store }, { selected }) {
    const song = store[STORE_VAR.SONG];

    switch (selected) {
      case DISPLAY_MODE.SPOTIFY:
        const storeHappi = store[STORE_VAR.HAPPI];
        if (storeHappi.state === API_STATE.IDLE) getHappiData(song);
        break;
      case DISPLAY_MODE.LYRICS:
        const storeLyrics = store[STORE_VAR.LYRICS];
        if (storeLyrics.state === API_STATE.IDLE) {
          const happi = store[STORE_VAR.HAPPI].response;
          const hasLyrics = happi[HAPPI_OBJ.HAS_LYRICS];
          const apiLyrics = happi[HAPPI_OBJ.API_LYRICS];
          getLyrics(song, hasLyrics ? apiLyrics : "");
        }
        break;
      case DISPLAY_MODE.YOUTUBE:
        const storeYoutube = store[STORE_VAR.YOUTUBE];
        if (storeYoutube.state === API_STATE.IDLE) getVideoId(song);
        break;
    }
    return {};
  }

  onSelected = selected => {
    this.setState({ selected });
  };

  render() {
    const { store, mediaControl, onClose, miniWindow } = this.props;
    const { selected } = this.state;

    return (
      <Root>
        <MenuWrapper>
          <MenuCollection
            selected={selected}
            onSelected={this.onSelected}
            store={store}
          />
        </MenuWrapper>
        {selected === DISPLAY_MODE.SPOTIFY && (
          <WrapperSpotify>
            <SpotifyPlayer
              store={store}
              mediaControl={mediaControl}
              onClose={onClose}
            ></SpotifyPlayer>
          </WrapperSpotify>
        )}
        {selected === DISPLAY_MODE.YOUTUBE && (
          <WrapperYoutube>
            <YoutubePlayer
              store={store}
              mediaControl={mediaControl}
              onClose={onClose}
            ></YoutubePlayer>
          </WrapperYoutube>
        )}
        {selected === DISPLAY_MODE.LYRICS && (
          <WrapperLyrics>
            <LyricsPlayer
              store={store}
              mediaControl={mediaControl}
              onClose={onClose}
            ></LyricsPlayer>
            {/* <R2C /> */}
          </WrapperLyrics>
        )}
      </Root>
    );
  }
}

export default App;
