/*global chrome */
import React from 'react';
import { MODE, ID } from '../constants';

import styled from 'styled-components';
import { Col, Separator, Img, CenterHV } from '../components'
import { getAllIcons } from '../constants/icon'

const { minimizeIcon, closeWhiteThinIcon } = getAllIcons(chrome);

const Wrapper = styled.div`
    width:100%;
    height:100%;
    background:transparent;
    text-align:center;
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

`;

class LyricsPlayer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    static getDerivedStateFromProps() {
        return {}
    }

    render() {
        const { songDetails, mediaControl, mode, onClose, lyrics } = this.props

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
                <CenterHV>
                    <Text>{lyrics ? lyrics : 'LYRICS NOT FOUND FOR THIS SONG'}</Text>
                </CenterHV>
            </Wrapper>
        );
    }
}

export default LyricsPlayer;
