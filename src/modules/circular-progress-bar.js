import React from 'react';

import styled from 'styled-components';
import 'react-circular-progressbar/dist/styles.css';
import '../css/circular-progress.css';

import { Img } from '../components'
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';

const REFRESH_INTERVAL = 500;
const FLOW_SMOOTHNESS = 2;
const STYLE = {
    ALBUM_ART_DIMENSION: 120,
}

const CircularImg = styled(Img)`
    border-radius:50%;
    z-index:5;
`;

export default class CircularProgress extends React.Component {
    // this.interval = setInterval(() => this.refresh(), REFRESH_INTERVAL);
    // clearInterval(this.interval);
    // {
    //     albumArt,
    //     playing,
    //     progressTime: (60 * parseInt(progressTime.split(':')[0], 10) + parseInt(progressTime.split(':')[1], 10)),
    //     totalTime: (60 * parseInt(totalTime.split(':')[0], 10) + parseInt(totalTime.split(':')[1], 10)),
    // }
    constructor(props) {
        super(props)
        this.state = {
            imageURL: '',
            progress: 0.0,
            total: 351.0,
            timeStamp: 0,
            playing: false,
            intervalId: '',
        }
    }

    static getDerivedStateFromProps({ albumArt, progressTime, totalTime, timeStamp, playing }, prevState) {
        // let intervalId = prevState.intervalId
        // if (!prevState.playing && playing) // Paused -> playing
        //     intervalId = setInterval(() => this.refresh(), REFRESH_INTERVAL);
        // else if (prevState.playing && !playing)// Playing -> pause
        //     clearInterval(intervalId);

        if (prevState.timeStamp !== timeStamp) // new time stamp -> props changed
            return {
                imageURL: albumArt,
                progress: (60 * parseInt(progressTime.split(':')[0], 10) + parseInt(progressTime.split(':')[1], 10)),
                total: (60 * parseInt(totalTime.split(':')[0], 10) + parseInt(totalTime.split(':')[1], 10)),
                timeStamp,
                playing,
                // intervalId,
            }

        return {}
    }

    componentDidMount() {
        this.interval = setInterval(() => this.refresh(), REFRESH_INTERVAL);
    }

    componentWillUnmount() {
        // const { intervalId } = this.state

        clearInterval(this.interval);
    }

    refresh() {
        const { playing, progress } = this.state
        console.log('refreshing')
        if (playing) {
            console.log('nv', progress + REFRESH_INTERVAL / 1000)
            this.setState({ progress: progress + REFRESH_INTERVAL / 1000 });
        }
    }

    render() {
        const { imageURL, progress, total } = this.state

        return (
            <div>
                <CircularProgressbarWithChildren
                    strokeWidth="3"
                    value={Math.floor(progress * FLOW_SMOOTHNESS)}
                    maxValue={total * FLOW_SMOOTHNESS}
                    styles={
                        buildStyles({
                            pathColor: `rgba(71, 143, 252, ${66 / 100})`,
                            trailColor: '#d6d6d6',
                            backgroundColor: '#3e98c7',
                        })}
                >
                    <CircularImg w={STYLE.ALBUM_ART_DIMENSION} h={STYLE.ALBUM_ART_DIMENSION} src={imageURL} alt='' onError="this.style.display='none'"></CircularImg>
                </CircularProgressbarWithChildren>
            </div>
        );
    }
}
