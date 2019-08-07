import React from 'react';
import { MODE,ID } from '../constants';

import styled from 'styled-components';
import { CenterHV } from '../components'

const Wrapper = styled.div`
    width:100%;
    height:30vh;
    border:2px solid yellow;
`;

const IFrame=styled.iframe`
    width:100%;
    height:30vh;
`;

class YoutubePlayer extends React.Component {

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
                <CenterHV>
                    <IFrame id={ID.YOUTUBE_IFRAME}
                    src="https://www.youtube.com/embed/dfnCAmr569k?autoplay=0&showinfo=0&controls=0" 
                    frameborder="0" allow="accelerometer; 
                    autoplay; 
                    encrypted-media; 
                    gyroscope; 
                    picture-in-picture" 
                    allowfullscreen>  
                    </IFrame>
                </CenterHV>
            </Wrapper>
        );
    }
}

export default YoutubePlayer;
