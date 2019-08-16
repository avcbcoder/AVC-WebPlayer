import React from 'react';
import { MODE, ID } from '../constants';

import styled from 'styled-components';
import { CenterHV } from '../components'



const w = Math.floor((window.screen.availWidth * 18) / 100)
const h = Math.floor((w * 9) / 16)

const Wrapper = styled.div`
    width:100%;
    height:100%;
    background:transparent;
    display:flex;
    flex-direction:column;
    align-items:center;
`;

const IFrame = styled.iframe`
    width:${w}px;
    height:${h}px;
    margin-top:10px;
`;

const ButtonCollection = styled.div`

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
