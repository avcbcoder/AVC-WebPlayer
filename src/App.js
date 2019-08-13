/*global screen*/
/* eslint no-restricted-globals:0 */

import React from 'react';
import PropTypes from 'prop-types';
import { MODE } from './constants';

import styled from 'styled-components';
import SpotifyPlayer from './modules/spotify-player'
import MenuCollection from './modules/menu-collection'

import { PLAYER } from './constants/dimension'
import { DISPLAY_MODE } from './constants/index';

const Root = styled.div`
    width:${(PLAYER.WIDTH_PERCENT * window.screen.availWidth) / 100}px;
    height:100vh;
`;

const MenuWrapper = styled.div`    
    width:${(PLAYER.WIDTH_PERCENT * window.screen.availWidth) / 100}px;
    position:fixed;
    right:30px;
    top:10px;
    overflow:hidden;
    z-index:5000;
    -webkit-box-shadow: 0px 0px 8px 2px rgba(163,145,163,1);
    -moz-box-shadow: 0px 0px 8px 2px rgba(163,145,163,1);
    box-shadow: 0px 0px 8px 2px rgba(163,145,163,1);
    border-radius:2px;
`;

const Wrapper = styled.div`
    width:${(PLAYER.WIDTH_PERCENT * window.screen.availWidth) / 100}px;
    height:${PLAYER.HEIGHT_VH}vh;
    position:fixed;
    right:30px;
    top:70px;
    overflow:hidden;
    -webkit-box-shadow: 0px 0px 8px 2px rgba(163,145,163,1);
    -moz-box-shadow: 0px 0px 8px 2px rgba(163,145,163,1);
    box-shadow: 0px 0px 8px 2px rgba(163,145,163,1);
    z-index:5000;
    border-radius:2px;
`;

class RootApp extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selected: DISPLAY_MODE.SPOTIFY,
    }
  }

  static getDerivedStateFromProps() {
    return {}
  }

  onSelected = (select) => {
    this.setState({ select })
  }

  render() {
    const { mode, songDetails, mediaControl, close } = this.props;
    const { select } = this.state

    return (
      <Root >
        <MenuWrapper>
          <MenuCollection select={select} onSelected={this.onSelected} />
        </MenuWrapper>
        {select === DISPLAY_MODE.SPOTIFY &&
          <Wrapper>
            <SpotifyPlayer mode={mode} songDetails={songDetails} mediaControl={mediaControl} close={close}></SpotifyPlayer>
          </Wrapper>
        }
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
  close: PropTypes.func,
  switchToYoutubeMode: PropTypes.func,
}

export default RootApp;
