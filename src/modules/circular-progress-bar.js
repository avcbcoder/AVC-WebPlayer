import React from 'react';
import PropTypes from 'prop-types';

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
    constructor(props) {
        super(props)
        this.state = {
            albumArt: '',
            progressTime: 0.0,
            totalTime: 351.0,
            refreshing: false,
        }
    }

    static getDerivedStateFromProps({ albumArt, progressTime, totalTime, playing }, { refreshing }) {
        if (!refreshing)
            return {
                albumArt,
                playing,
                progressTime: (60 * parseInt(progressTime.split(':')[0], 10) + parseInt(progressTime.split(':')[1], 10)),
                totalTime: (60 * parseInt(totalTime.split(':')[0], 10) + parseInt(totalTime.split(':')[1], 10)),
            }
        return {}
    }

    componentDidMount() {
        this.interval = setInterval(() => this.refresh(), REFRESH_INTERVAL);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    refresh() {
        const { playing, progressTime } = this.state
        console.log('refreshing')
        if (playing)
            this.setState({ refreshing: true, progressTime: progressTime + REFRESH_INTERVAL / 1000 });
    }

    render() {
        const { albumArt, progressTime, totalTime } = this.state

        console.log(progressTime)
        return (
            <div>
                <CircularProgressbarWithChildren
                    strokeWidth="3"
                    value={Math.floor(progressTime * FLOW_SMOOTHNESS)}
                    maxValue={totalTime * FLOW_SMOOTHNESS}
                    styles={
                        buildStyles({
                            pathColor: `rgba(71, 143, 252, ${66 / 100})`,
                            trailColor: '#d6d6d6',
                            backgroundColor: '#3e98c7',
                        })}
                >
                    <CircularImg w={STYLE.ALBUM_ART_DIMENSION} h={STYLE.ALBUM_ART_DIMENSION} src={albumArt} alt='' onError="this.style.display='none'"></CircularImg>
                </CircularProgressbarWithChildren>
            </div>
        );
    }
}
