/*global chrome */
import React from 'react';
import { MODE, ID, DEFAULT_LYRICS } from '../constants/index';

import styled, { css, keyframes } from 'styled-components';
import { Col, Separator, Img, CenterHV } from '../components'
import { getAllIcons } from '../constants/icon'
import { COLOR } from '../constants/color'

const { minimizeIcon, closeWhiteThinIcon } = getAllIcons(chrome);

const Wrapper = styled.div`
    width:100%;
    height:100%;
    background:transparent;
    text-align:center;
    background:${COLOR.BLACK};
    display:flex;
    flex-direction:column;
    align-content:center;
    align-items:center;
`;

const ButtonCollection = styled.div`
    width:100%;
    padding-right:8px;
    display:flex;
    flex-direction:row;
    justify-content:flex-end;
    align-items:center;
`;

const Text = styled.div`
    color:${COLOR.WHITE_LYRICS};
`;

const LyricsBox = styled.div`
    border: "5px solid white";
    text-align:center;
    width:90%;
    height:70%;
    overflow-x:hidden;
    overflow-y:scroll;
    position: relative;
    box-sizing: border-box;
`;

const scroll = keyframes`
  0% {
    top: 8em;
  }
  100% {
    top: -11em;
  }
`;

const Marquee = styled.p`
    top: 6em;
    position: relative;
    box-sizing: border-box;
    animation: ${ scroll} 15s linear infinite;
    &:hover{
        animation-play-state: paused;
    }
    &:after{
        left: 0;
        z-index: 1;
        content: '';
        position: absolute;
        pointer-events: none;
        width: 100%; height: 2em;
        background-image: linear-gradient(180deg, #FFF, rgba(255,255,255,0));
        bottom: 0;
        transform: rotate(180deg);
    }
    &::after{
        left: 0;
        z-index: 1;
        content: '';
        position: absolute;
        pointer-events: none;
        width: 100%; height: 2em;
        background-image: linear-gradient(180deg, #FFF, rgba(255,255,255,0));
        bottom: 0;
        transform: rotate(180deg);
    }
    &:before{
        left: 0;
        z-index: 1;
        content: '';
        position: absolute;
        pointer-events: none;
        width: 100%; height: 2em;
        background-image: linear-gradient(180deg, #FFF, rgba(255,255,255,0));
        top: 0;
    }
    &::before{
        left: 0;
        z-index: 1;
        content: '';
        position: absolute;
        pointer-events: none;
        width: 100%; height: 2em;
        background-image: linear-gradient(180deg, #FFF, rgba(255,255,255,0));
        top: 0;
    }
`;

class LyricsPlayer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {

        }
        this.refLyricsBox = React.createRef();
    }

    static getDerivedStateFromProps() {
        return {}
    }

    replace = (str, a, b) => {
        //Method 1 
        return str.split(a).join(b)
        //Method 2 - using regular expression
    }

    render() {
        const { songDetails, mediaControl, mode, onClose, lyrics } = this.props
        const lyricsArr = this.replace(lyrics ? lyrics : DEFAULT_LYRICS, `\n\n`, `\n \n`).split('\n')

        return (
            <Wrapper>
                <Separator height="12" />
                <ButtonCollection>
                    <Img w="15" h="15" src={minimizeIcon} onClick={() => onClose()} style={{ cursor: 'pointer' }}></Img>
                    <Separator width="16" />
                    <Img w="15" h="15" src={closeWhiteThinIcon} style={{ cursor: 'pointer' }}></Img>
                    <Separator width="16" />
                </ButtonCollection>
                <Separator height="14" />
                <LyricsBox>
                    <Marquee>
                        {lyricsArr.map(lyric => (
                            <Text >{lyric === ' ' ? <br /> : lyric}</Text>
                        ))}
                    </Marquee>
                </LyricsBox>
            </Wrapper>
        );
    }
}

export default LyricsPlayer;
