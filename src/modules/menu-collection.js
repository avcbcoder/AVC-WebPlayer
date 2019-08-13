import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { getAllIcons } from '../constants/icon'
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
    border-radius: 4px;
    overflow: hidden;
    -webkit-box-shadow: 0px 0px 8px 2px rgba(163,145,163,1);
    -moz-box-shadow: 0px 0px 8px 2px rgba(163,145,163,1);
    box-shadow: 0px 0px 8px 2px rgba(163,145,163,1);
`;

const Link = styled.a`
    padding: 1em;
    background-color: #BADA55;
    color: #fff;
    font-weight: bold;
    text-decoration: none;
    display: block;
    &:hover{
        background-color: #A3C43B;
        text-decoration:none;
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
        return (
            <TabsWrapper>
                <Tabs>
                    <TabItem>
                        <Link href="#" >Spotify</Link>
                    </TabItem>
                    <TabItem>
                        <Link href="#" >Lyrics</Link>
                    </TabItem>
                    <TabItem>
                        <Link href="#" >Youtube</Link>
                    </TabItem>
                </Tabs>
            </TabsWrapper>
        );
    }

}

export default MenuCollection;

// {/* <ul class="tabs  primary-nav">
//     <li class="tabs__item">
//         <a href="#" class="tabs__link">Home</a>
//     </li>
//     <li class="tabs__item">
//         <a href="#" class="tabs__link">About</a>
//     </li>
//     <li class="tabs__item">
//         <a href="#" class="tabs__link">Work</a>
//     </li>
//     <li class="tabs__item">
//         <a href="#" class="tabs__link">Contact</a>
//     </li>
// </ul> */}

// .tabs {
//     margin: 0;
//     padding: 0;
//     list - style: none;
//     display: table; /* [1] */
//     table - layout: fixed; /* [2] */
//     width: 100 %; /* [3] */
// }

//     .tabs__item {
//     display: table - cell; /* [4] */
// }

//         .tabs__link {
//     display: block; /* [5] */
// }

// .primary-nav {
//     text-align: center;
//     border-radius: 4px;
//     overflow: hidden; /* [1] */
// }

//         .primary-nav a {
//             padding: 1em;
//             background-color: #BADA55;
//             color: #fff;
//             font-weight: bold;
//             text-decoration: none;
//         }

//         .primary-nav a:hover {
//             background-color: #A3C43B;
//         }
