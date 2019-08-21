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
    }

    render() {
        const { store, mediaControl, onClose } = this.props;

        console.log("ROOT", store)
        return (
            <App store={store} mediaControl={mediaControl} onClose={onClose} />
        );
    }
}

export default RootApp;
