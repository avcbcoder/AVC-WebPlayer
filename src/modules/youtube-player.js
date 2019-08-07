import React from 'react';
import { MODE } from '../constants';

import styled from 'styled-components';

const Wrapper = styled.div`
    width:100%;
    height:30vh;
    border:2px solid yellow;
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
        return (
            <Wrapper>

            </Wrapper>
        );
    }
}

export default SpotifyPlayer;
