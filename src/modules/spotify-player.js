/*global chrome */
import { request } from "http";

import React from 'react';
import PropTypes from 'prop-types';
import { MODE, ID, CONTROLS } from '../constants/index';
import { CenterHV, Col, Separator } from '../components'

import styled from 'styled-components';
import 'react-circular-progressbar/dist/styles.css';
import '../css/circular-progress.css';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import { THEME } from '../constants/color';

const playIcon = chrome.runtime.getURL("img/play.png")
const pauseIcon = chrome.runtime.getURL("img/pause.png")
const prevIcon = chrome.runtime.getURL("img/prev.png")
const nextIcon = chrome.runtime.getURL("img/next.png")
const gifPause1 = chrome.runtime.getURL("img/gif-pause-1.png")
const gifPause2 = chrome.runtime.getURL("img/gif-pause-2.png")
const gifPlay = chrome.runtime.getURL("img/music_gif.gif")
const shuffleIcon = chrome.runtime.getURL("img/shuffle.png")
const repeatIcon = chrome.runtime.getURL("img/repeat.png")


const STYLE = {
    ALBUM_ART_DIMENSION: 100,
}

const Wrapper = styled.div`
    width:100%;
    height:74vh;
    /* border:1px solid yellow; */
    background: #fff;
    overflow:hidden;
    position:relative;
`;

const Upper = styled.div`
    width:100%;
    height:36vh;
    /* border:1px solid blue; */
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    align-items:center;
`;

const Bottom = styled.div` 
    width:100%;
    height:38vh;
    display:flex;
    flex-direction:column;
`;

const Background = styled.div`
    background:#ed9092;
    width:100%;
    height:100%;
    display:flex;
    flex-direction:column;
    justify-content:space-evenly;
`;

const Control = styled.div`
    margin-top:-4px;
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
    /* border:1px solid red; */
`;

const PlaylistControlRepeat = styled.div`
    position:absolute;
    /* border:1px solid red; */
    bottom:-28px;
    right:-28px;
`;

const PlaylistControlShuffle = styled.div`
    position:absolute;
    /* border:1px solid red; */
    bottom:-28px;
    left:-28px;
`;

const AlbumArtImage = styled.div`
    margin-top:40px;
`;

const Img = styled.img`
    width:${({ w }) => w}px;
    height:${({ h }) => h}px;
`;

const CircularImg = styled(Img)`
    border-radius:50%;
    z-index:5;
`;

const Gif = styled.img`
    width:100%;
    height:80px;
`;

const PlayPauseButton = styled.div`
    border-radius:50%;
    background:#fff;
    padding:5px;
    box-shadow: 0px 8px 16px #6b5f5f;
    margin-left:30px;
    margin-right:30px;
    cursor:pointer;
`;

const NextButton = styled.div`
    cursor: pointer;
    &:hover{-webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    -webkit-box-shadow: 0px 0px 30px 0px rgba(255, 255, 255, 0.67);
    -moz-box-shadow: 0px 0px 30px 0px rgba(255, 255, 255, 0.67);
    box-shadow: 0px 0px 30px 0px rgba(255, 255, 255, 0.67);
    }
`;

const PrevButton = styled.div`
    cursor:pointer;
    &:hover{-webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    -webkit-box-shadow: 0px 0px 30px 0px rgba(255, 255, 255, 0.67);
    -moz-box-shadow: 0px 0px 30px 0px rgba(255, 255, 255, 0.67);
    box-shadow: 0px 0px 30px 0px rgba(255, 255, 255, 0.67);
    }
`;

const Details = styled.div`
    text-align:center;
    color:#fff;
    padding-left:10px;
    padding-right:10px;
    /* border:1px solid blue; */
`;

const Track = styled.div`
    font-size:20px;
    text-shadow: 2px 2px 3px #fff;
    overflow:hidden;
    white-space:nowrap;
`;

const Artist = styled.div`
    font-weight:700;
`;

const ImgR = styled(Img)`
    position:absolute;
    top:8px;
    left:8px;
`;

const ImgS = styled(Img)`
    position:absolute;
    top:8px;
    right:8px;
`;

const Pie = styled.div`
    border-radius:50%;
    background:#fff;
    width:60px;
    height:60px;
    position:relative;
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

    getProgress = (progressTime, totalTime) => {
        var p = 60 * parseInt(progressTime.split(':')[0], 10) + parseInt(progressTime.split(':')[1], 10)
        var t = 60 * parseInt(totalTime.split(':')[0], 10) + parseInt(totalTime.split(':')[1], 10)
        return Math.floor((p / t) * 100);
    }

    render() {
        const { songDetails, mediaControl, mode } = this.props
        const { title, artist, albumArt, totalTime, progressTime, playing } = songDetails;
        console.log('mode', playing)
        return (
            <Wrapper>
                <Upper>
                    <AlbumArtImage>
                        <CircularProgressbarWithChildren
                            strokeWidth="3"
                            value={Math.floor(Math.abs(this.getProgress(progressTime, totalTime)))}
                            styles={
                                buildStyles({
                                    pathColor: `rgba(71, 143, 252, ${66 / 100})`,
                                    trailColor: '#d6d6d6',
                                    backgroundColor: '#3e98c7',
                                })}
                        >
                            <CircularImg w={STYLE.ALBUM_ART_DIMENSION} h={STYLE.ALBUM_ART_DIMENSION} src={albumArt}></CircularImg>
                        </CircularProgressbarWithChildren>
                    </AlbumArtImage>
                </Upper>
                <Bottom>
                    <Gif src={playing ? gifPlay : Math.floor(Math.random() * 100) % 2 === 0 ? gifPause1 : gifPause2}>
                    </Gif>
                    <Background>
                        <Details>
                            <Track>{title}</Track>
                            <Separator h="8"></Separator>
                            <Artist>{artist}</Artist>
                        </Details>
                        <Control>
                            <PrevButton>
                                <Img src={prevIcon} w={30} h={30} onClick={() => { mediaControl(CONTROLS.PREV) }} style={{ cursor: 'pointer' }}></Img>
                            </PrevButton>
                            <PlayPauseButton>
                                <Img src={playing ? playIcon : pauseIcon} w={30} h={30} onClick={() => { mediaControl(CONTROLS.PLAY) }} style={{ cursor: 'pointer' }}></Img>
                            </PlayPauseButton>
                            <NextButton>
                                <Img src={nextIcon} w={30} h={30} onClick={() => { mediaControl(CONTROLS.NEXT) }} style={{ cursor: 'pointer' }}></Img>
                            </NextButton>
                        </Control>
                    </Background>
                </Bottom>
                <PlaylistControlShuffle><Pie><ImgS src={shuffleIcon} w={20} h={20} onClick={() => { mediaControl(CONTROLS.SHUFFLE) }} style={{ cursor: 'pointer' }}></ImgS></Pie></PlaylistControlShuffle>
                <PlaylistControlRepeat><Pie><ImgR src={repeatIcon} w={20} h={20} onClick={() => { mediaControl(CONTROLS.REPEAT) }} style={{ cursor: 'pointer' }}></ImgR></Pie></PlaylistControlRepeat>
            </Wrapper >
        );
    }
}

export default SpotifyPlayer;