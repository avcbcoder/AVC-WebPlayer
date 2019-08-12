/*global screen*/
/* eslint no-restricted-globals:0 */

import React from 'react';
import PropTypes from 'prop-types';
import { MODE } from './constants';

import styled from 'styled-components';
import SpotifyPlayer from './modules/spotify-player'
import YoutubePlayer from './modules/youtube-player'
import { PLAYER } from './constants/dimension'

const Root = styled.div`
    width:${(PLAYER.WIDTH_PERCENT * screen.availWidth) / 100}px;
height:${PLAYER.HEIGHT_VH}vh;
    /* border:1px solid red; */
    position:fixed;
    right:30px;
    top:10px;
    overflow:hidden;
    -webkit-box-shadow: 0px 0px 22px 7px rgba(163,145,163,1);
    -moz-box-shadow: 0px 0px 22px 7px rgba(163,145,163,1);
    box-shadow: 0px 0px 22px 7px rgba(163,145,163,1);
    z-index:5000;
    border-radius:1%;
`;

const Wrapper = styled.div`
`;

class RootApp extends React.Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  static getDerivedStateFromProps() {
    return {}
  }

  render() {
    const { mode, songDetails, mediaControl } = this.props;

    return (
      <Root >
        <Wrapper>
          <SpotifyPlayer mode={mode} songDetails={songDetails} mediaControl={mediaControl}></SpotifyPlayer>
        </Wrapper>
      </Root>
    );
  }
}

RootApp.defaultProps = {
  mode: MODE.NONE,
  songDetails: {
    title: 'Go to https://open.spotify.com to start the player',
    artist: [],
    albumArt: '',
    progressTime: '0:00',
    totalTime: '0:00',
    playing: false,
  }
}

RootApp.prototypes = {
  mode: PropTypes.string,
  songDetails: PropTypes.shape({}),
  mediaControl: PropTypes.func,
  switchToYoutubeMode: PropTypes.func,
}

export default RootApp;
