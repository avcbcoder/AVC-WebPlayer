/*global chrome */
import { request } from "http";

import React from 'react';
import PropTypes from 'prop-types';
import { MODE, ID } from '../constants';
import { CenterHV, Col } from '../components'

import styled from 'styled-components';
import 'react-circular-progressbar/dist/styles.css';
import '../css/circular-progress.css';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import { THEME } from '../constants/color'

const STYLE = {
    ALBUM_ART_DIMENSION: 100,
}

const Wrapper = styled.div`
    width:100%;
    height:70vh;
    /* border:1px solid yellow; */
    background: #fff;
    overflow:hidden;
`;

const Upper = styled.div`
    width:100%;
    height:42vh;
    /* border:1px solid blue; */
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    align-items:center;
`;

const Bottom = styled.div`
    width:100%;
    height:28vh;
    /* border:1px solid red; */
    /* position:relative; */
`;

const Bkg = styled(Col)`
    position:absolute;
    width:100%;
    height:100%;
    background:#ed9092;
`;

const Control = styled.div`
    /* position:absolute; */
    width:100%;
    height:100%;
    background:#ed9092;
    margin-top:-4px;
`;

const AlbumArtImage = styled.div`
    margin-top:30px;
`;

const Img = styled.img`
    width:${STYLE.ALBUM_ART_DIMENSION}px;
    height:${STYLE.ALBUM_ART_DIMENSION}px;
    border-radius:50%;
    z-index:5;
`;

const Gif = styled.img`
    width:100%;
    height:80px;
`;

class SpotifyPlayer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    static getDerivedStateFromProps() {
        return {}
    }

    render() {
        const { songDetails, mediaControl } = this.props
        const { title, artist, albumArt } = songDetails;

        return (
            <Wrapper>
                <Upper>
                    <AlbumArtImage>
                        <CircularProgressbarWithChildren
                            strokeWidth="3"
                            value={66}
                            styles={
                                buildStyles({
                                    pathColor: `rgba(71, 143, 252, ${66 / 100})`,
                                    trailColor: '#d6d6d6',
                                    backgroundColor: '#3e98c7',
                                })}
                        >
                            <Img src="https://i.scdn.co/image/b6ffd4e91e38a0ce4e9ed0adf08f841d6262a949"></Img>
                        </CircularProgressbarWithChildren>
                    </AlbumArtImage>
                </Upper>
                <Bottom>
                    <Gif src={chrome.runtime.getURL("img/music_gif.gif")}>
                    </Gif>
                    <Control></Control>
                </Bottom>
            </Wrapper >
        );
    }
}

export default SpotifyPlayer;