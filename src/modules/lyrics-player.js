/*global chrome */
import React from 'react';
import { MODE, ID } from '../constants';

import styled from 'styled-components';
import { Col, Separator, Img, CenterHV } from '../components'
import { getAllIcons } from '../constants/icon'
import { COLOR } from '../constants/color'

const { minimizeIcon, closeWhiteThinIcon } = getAllIcons(chrome);

const Wrapper = styled.div`
    width:100%;
    height:100%;
    background:transparent;
    text-align:center;
    background:${COLOR.BLACK};
    display:flex;
    flex-direction:column;
    align-content:center;
    align-items:center;
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
    color:${COLOR.WHITE};
`;

const LyricsBox = styled.div`
    border: "5px solid white";
    text-align:center;
    width:90%;
    height:70%;
    overflow:hidden;
`;

const Sample = `Boy, you're lookin' like my type
But tell me, can you hit it right?
'Cause if I let you in tonight
You better put it da-da-down da-da-down

Now we do without the talk
I ain't playin' any more
You heard me when I said before
You better put it da-da-down da-da-down

Make me say you the one I like, like, like, like
Come put your body on mine, mine, mine, mine
Keep it up all night, night, night, night
Don't let me down da-da-down

All night give me mad love
All night give me mad love
All night give me mad love
Yeah, don't let me down da-da-down
All night give me mad love
All night give me mad love
All night give me mad love
Yeah, don't let me down da-da-down

Yo, come over, we can chill
Tell each other how we feel
But, baby, know I love the thrill
When you put it da-da-down da-da-down

I'm alright on my own
But with you I'm in the zone
One shot, don't let it go
You better put it da-da-down da-da-down

Make me say you the one I like, like, like, like
Come put your body on mine, mine, mine, mine
Keep it up all night, night, night, night
Don't let me down da-da-down

All night give me mad love
All night give me mad love
All night give me mad love
Yeah, don't let me down da-da-down
All night give me mad love
All night give me mad love
All night give me mad love
Yeah, don't let me down da-da-down

If I back up, can you handle?
Get it all night, give me mad love
Don't be too nice, feel the mad love
Now don't let me down da-da-down
If I back up, can you handle?
Get it all night, give me mad love
Don't be too nice, feel the mad love
Now don't let me down da-da-down

All night give me mad love
All night give me mad love
All night give me mad love
Yeah, don't let me down da-da-down
All night give me mad love
All night give me mad love
All night give me mad love
Yeah, don't let me down da-da-down

Make me say you the one I like, like, like, like
Come put your body on mine, mine, mine, mine
Keep it up all night, night, night, night
Don't let me down da-da-down

If I back up, can you handle?
Get it all night, give me mad love
Don't be too nice, feel the mad love
Yeah, don't let me down da-da-down
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

        console.log(Sample)
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
                <LyricsBox>
                    <Text>{lyrics ? lyrics : Sample}</Text>
                </LyricsBox>
            </Wrapper>
        );
    }
}

export default LyricsPlayer;
