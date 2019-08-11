import React from 'react';
import PropTypes from 'prop-types';
import { MODE } from './constants';

import styled from 'styled-components';
import SpotifyPlayer from './modules/spotify-player'
import YoutubePlayer from './modules/youtube-player'


const Root = styled.div`
    width:26%;
    height:98vh;
    /* border:1px solid red; */
    position:fixed;
    right:30px;
    top:10px;
    overflow:hidden;
    -webkit-box-shadow: 0px 0px 22px 7px rgba(163,145,163,1);
-moz-box-shadow: 0px 0px 22px 7px rgba(163,145,163,1);
box-shadow: 0px 0px 22px 7px rgba(163,145,163,1);
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

  render() {
    return (
      <Root >
        <Wrapper>
          <SpotifyPlayer mode songDetails mediaControl></SpotifyPlayer>
          {/* <YoutubePlayer mode songDetails></YoutubePlayer> */}
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
