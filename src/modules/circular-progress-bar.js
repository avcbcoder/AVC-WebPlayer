import React from "react";

import styled from "styled-components";
import "react-circular-progressbar/dist/styles.css";
import "../css/circular-progress.css";

import { Img } from "../components";
import {
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";

const REFRESH_INTERVAL = 500;
const FLOW_SMOOTHNESS = 2;
const STYLE = {
  ALBUM_ART_DIMENSION: 120
};

const CircularImg = styled(Img)`
  border-radius: 50%;
  z-index: 5;
`;

export default class CircularProgress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0.0,
      timeStamp: 0
    };
  }

  static getDerivedStateFromProps({ progressTime, timeStamp, time }, state) {
    if (state.timeStamp !== timeStamp)
      // new time stamp -> props changed
      return {
        progress: progressTime + (new Date().getTime() - time) / 1000,
        timeStamp
      };
    return {};
  }

  componentDidMount() {
    this.interval = setInterval(() => this.refresh(), REFRESH_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  refresh() {
    const { playing, progressTime, time } = this.props;

    if (playing) {
      this.setState({
        progress: progressTime + (new Date().getTime() - time) / 1000
      });
    }
  }

  render() {
    const { albumArt, totalTime } = this.props;
    const { progress } = this.state;

    return (
      <div>
        <CircularProgressbarWithChildren
          strokeWidth="3"
          value={Math.floor(progress * FLOW_SMOOTHNESS)}
          maxValue={totalTime * FLOW_SMOOTHNESS}
          styles={buildStyles({
            pathColor: `rgba(71, 143, 252, ${66 / 100})`,
            trailColor: "#d6d6d6",
            backgroundColor: "#3e98c7"
          })}
        >
          <CircularImg
            w={STYLE.ALBUM_ART_DIMENSION}
            h={STYLE.ALBUM_ART_DIMENSION}
            src={albumArt}
            alt=""
            onError="this.style.display='none'"
          ></CircularImg>
        </CircularProgressbarWithChildren>
      </div>
    );
  }
}
