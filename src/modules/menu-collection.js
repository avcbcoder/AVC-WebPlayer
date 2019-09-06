import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import { THEME } from "../constants/color";
import { DISPLAY_MODE, HAPPI_OBJ, STORE_VAR } from "../constants/index";
import { getLyrics, getVideoId } from "../extension-background/sender";

const Tabs = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: table;
  table-layout: fixed;
  width: 100%;
  text-align: center;
  overflow: hidden;
`;

const Link = styled.a`
  padding: 1em;
  background-color: ${({ selected }) =>
    selected ? THEME.PLAYER_BLUE : THEME.PLAYER_PINK};
  color: #fff;
  font-weight: bold;
  text-decoration: none;
  display: block;
  cursor: pointer;
  &:hover {
    background-color: ${({ selected }) =>
      selected ? THEME.PLAYER_BLUE : THEME.PLAYER_PINK_HOVER};
    text-decoration: none;
  }
  &:active {
    color: #fff;
  }
`;

const TabItem = styled.li`
  display: table-cell;
`;

class MenuCollection extends React.Component {
  render() {
    const { selected, onSelected, store } = this.props;
    const songDetails = store[STORE_VAR.SONG];
    const happi = store[STORE_VAR.HAPPI].response;
    const hasLyrics = happi[HAPPI_OBJ.HAS_LYRICS];
    const apiLyrics = happi[HAPPI_OBJ.API_LYRICS];

    return (
      <React.Fragment>
        <Tabs>
          <TabItem>
            <Link
              selected={selected === DISPLAY_MODE.SPOTIFY}
              onClick={() => {
                onSelected(DISPLAY_MODE.SPOTIFY);
              }}
            >
              Spotify
            </Link>
          </TabItem>
          <TabItem>
            <Link
              selected={selected === DISPLAY_MODE.LYRICS}
              onClick={() => {
                getLyrics(songDetails, hasLyrics ? apiLyrics : "");
                onSelected(DISPLAY_MODE.LYRICS);
              }}
            >
              Lyrics
            </Link>
          </TabItem>
          <TabItem>
            <Link
              selected={selected === DISPLAY_MODE.YOUTUBE}
              onClick={() => {
                getVideoId(songDetails);
                onSelected(DISPLAY_MODE.YOUTUBE);
              }}
            >
              Youtube
            </Link>
          </TabItem>
        </Tabs>
      </React.Fragment>
    );
  }
}

export default MenuCollection;
