/*global chrome*/
import React from 'react';
import PropTypes from 'prop-types';
import { MODE } from './constants';

import styled from 'styled-components';
import SpotifyPlayer from './modules/spotify-player'
import YoutubePlayer from './modules/youtube-player'


const Root = styled.div`
    width:30%;
    height:100vh;
    border:1px solid red;
    position:fixed;
    right:0;
    z-index:5000;
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

  switchToMiniMode = () => {
    console.log('wait switching...')
    chrome.runtime.sendMessage({
      type: "mini-mode", options: {
        url: 'https://www.youtube.com/watch?v=Dkk9gvTmCXY&autoplay=1'
      }
    });
    setTimeout(() => {
      console.log('start mini mode')
      chrome.runtime.sendMessage({
        type: "start-mini-mode", options: {
          url: 'https://www.youtube.com/watch?v=Dkk9gvTmCXY'
        }
      });
    }, 1000);
  }

  render() {
    return (
      <Root >
        <Wrapper>
          <SpotifyPlayer mode songDetails mediaControl switchToMiniMode={this.switchToMiniMode}></SpotifyPlayer>
          <YoutubePlayer mode songDetails></YoutubePlayer>
        </Wrapper>
      </Root>
    );
  }
}

RootApp.defaultProps = {
  mode: MODE.NONE,
  songDetails: {
    title: 'Go to https://open.spotify.com to enable the player',
    artist: [],
    albumArt: '',
  }
}

RootApp.prototypes = {
  mode: PropTypes.string,
  songDetails: PropTypes.shape({}),
  mediaControl: PropTypes.func,
  switchToYoutubeMode: PropTypes.func,
}

export default RootApp;
