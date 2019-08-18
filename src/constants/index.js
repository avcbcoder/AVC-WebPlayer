const MODE = {
    NONE: 'none',
    SPOTIFY_MODE: {
        PLAYING: 'playing',
        IDLE: 'idle',
    },
    SPOTIFY: 'spotify',
    YOUTUBE: 'youtube',
    MINI_WINDOW: 'min_youtube',
}

const ID = {
    YOUTUBE_IFRAME: 'yt_401',
}

const CONTROLS = {
    NEXT: 'next',
    PREV: 'previous',
    SHUFFLE: 'shuffle',
    REPEAT: 'repeat',
    PLAY: 'play'
}

const DISPLAY_MODE = {
    YOUTUBE: 'youtube',
    SPOTIFY: 'spotify',
    LYRICS: 'lyrics',
    MINI_YOUTUBE: 'mini-youtube',
    MINI_SPOTIFY: 'mini-spotify',
}

const DEFAULT_LYRICS = `Boy, you're lookin' like my type
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
`;

export { MODE, ID, CONTROLS, DISPLAY_MODE, DEFAULT_LYRICS }