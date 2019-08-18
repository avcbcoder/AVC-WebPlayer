/*global chrome*/

import React from 'react';
import styled from 'styled-components';
import App from '../app';

class RootApp extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            lyrics: ''
        }
        this.prevTitle = ''
    }

    static getDerivedStateFromProps() {
        return {}
    }

    componentDidUpdate(prevProvs) {
        console.log('component did update')
        console.log('prevProvs', prevProvs)
        console.log('newProvs', this.props)
    }

    render() {
        const { songDetails, mediaControl, onClose } = this.props;

        return (
            <App songDetails={songDetails} mediaControl={mediaControl} onClose={onClose} />
        );
    }
}

export default RootApp;
