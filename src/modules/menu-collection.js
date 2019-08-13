import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
// import { getAllIcons } from '../constants/icon'
import { THEME } from '../constants/color';
import { DISPLAY_MODE } from '../constants/index';

// const { playIcon, prevIcon, nextIcon, gifPause1, gifPause2, shuffleIcon, gifPlay, repeatIcon, menuIcon, closeIcon, pauseIcon, menuWhiteIcon, closeWhiteIcon } = getAllIcons(chrome);


const TabsWrapper = styled.div`
    /* border:1px solid red; */
`;

const Tabs = styled.ul`
    margin:  0;
    padding: 0;
    list-style: none;
    display: table; 
    table-layout: fixed; 
    width: 100%; 
    text-align: center;
    overflow: hidden;
`;

const Link = styled.a`
    padding: 1em;
    background-color:${({ selected }) => selected ? THEME.PLAYER_BLUE : THEME.PLAYER_PINK}; 
    color: #fff;
    font-weight: bold;
    text-decoration: none;
    display: block;
    &:hover{
        background-color:${({ selected }) => selected ? THEME.PLAYER_BLUE : THEME.PLAYER_PINK_HOVER};
        text-decoration:none;
    }
    &:active{
        color:#fff;
    }
`;

const TabItem = styled.li`
    display: table-cell;
`;

class MenuCollection extends React.Component {

    constructor(props) {
        super(props)
        this.state = {

        }
        this.refMenuWrapper = React.createRef();
    }

    static getDerivedStateFromProps() {
        return {}
    }

    render() {
        const { selected, onSelected } = this.props

        return (
            <TabsWrapper>
                <Tabs>
                    <TabItem>
                        <Link
                            selected={selected === DISPLAY_MODE.SPOTIFY}
                            onClick={() => { onSelected(DISPLAY_MODE.SPOTIFY) }}
                        >
                            Spotify
                        </Link>
                    </TabItem>
                    <TabItem>
                        <Link
                            selected={selected === DISPLAY_MODE.LYRICS}
                            onClick={() => { onSelected(DISPLAY_MODE.LYRICS) }}
                        >
                            Lyrics
                        </Link>
                    </TabItem>
                    <TabItem>
                        <Link
                            selected={selected === DISPLAY_MODE.YOUTUBE}
                            onClick={() => { onSelected(DISPLAY_MODE.YOUTUBE) }}
                        >
                            Youtube
                        </Link>
                    </TabItem>
                </Tabs>
            </TabsWrapper>
        );
    }

}

export default MenuCollection;
