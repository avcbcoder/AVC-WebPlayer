/*global chrome */
import React from "react";
import { MODE, ID, DEFAULT_VIDEO_ID } from "../constants";

import styled from "styled-components";
import { Col, Separator, Img, CenterHV } from "../components";
import { getAllIcons } from "../constants/icon";
import { STORE_VAR, API_STATE } from "../constants";

const { minimizeIcon, closeWhiteIcon, closeWhiteThinIcon } = getAllIcons(
  chrome
);

const w = Math.floor((window.screen.availWidth * 20) / 100);
const h = Math.floor((w * 9) / 16);

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: transparent;
  text-align: center;
`;

const IFrame = styled.iframe`
  width: ${w}px;
  height: ${h}px;
`;

const ButtonCollection = styled.div`
  width: 100%;
  padding-right: 8px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

// use => http://i.ytimg.com/vi/${videoId}/maxresdefault.jpg
class YoutubePlayer extends React.Component {
  render() {
    const { store, onClose } = this.props;
    const { state, response } = store[STORE_VAR.YOUTUBE];
    let videoId = DEFAULT_VIDEO_ID;

    if (state === API_STATE.SUCCESS && response && response.length > 0)
      videoId = response[0].videoId;

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
        <CenterHV>
          <IFrame
            id={ID.YOUTUBE_IFRAME}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&showinfo=0&controls=0`}
            frameborder="0"
            allow="accelerometer; 
                    autoplay; 
                    encrypted-media; 
                    gyroscope; 
                    picture-in-picture"
            allowfullscreen
          ></IFrame>
        </CenterHV>
      </Wrapper>
    );
  }
}

export default YoutubePlayer;
