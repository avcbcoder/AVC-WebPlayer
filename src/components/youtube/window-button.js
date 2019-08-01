import React from 'react';
import styled from 'styled-components'
import icon from "../../img/win.png"

const Div = styled.div`
    width:50px;
    height:50px;
    border:1px solid red;
`;

const Img = styled.img`
    width:40px;
    height:40px;
`;

export default class WindowButton extends React.Component {
    // magic = (document) => {
    //     document.getElementById('video')[0].requestPictureInPicture();
    // }
    render() {
        const { magic } = this.props;
        return (
            <Div onClick={magic} >
                <Img src={icon}></Img>
            </Div>
        );
    }
}