import React from 'react';
import PropTypes from 'prop-types';
import { MODE } from '../constants';

import styled from 'styled-components';

const Wrapper = styled.div`
    width:100%;
    height:70vh;
    border:1px solid blue;
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
        const { songDetails, mediaControl, switchToMiniMode } = this.props
        const { title, artist, albumArt } = songDetails;

        return (
            <Wrapper>
<button onClick={switchToMiniMode}>playInMiniMode</button>
            </Wrapper>
        );
    }
}

export default SpotifyPlayer;
