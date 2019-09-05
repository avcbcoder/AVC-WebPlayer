const MODE = {
  NONE: "none",
  SPOTIFY_MODE: {
    PLAYING: "playing",
    IDLE: "idle"
  },
  SPOTIFY: "spotify",
  YOUTUBE: "youtube",
  MINI_WINDOW: "min_youtube"
};

const ID = {
  YOUTUBE_IFRAME: "yt_401"
};

const CONTROLS = {
  NEXT: "next",
  PREV: "previous",
  SHUFFLE: "shuffle",
  REPEAT: "repeat",
  PLAY: "play"
};

const DISPLAY_MODE = {
  YOUTUBE: "youtube",
  SPOTIFY: "spotify",
  LYRICS: "lyrics",
  MINI_YOUTUBE: "mini-youtube",
  MINI_SPOTIFY: "mini-spotify"
};

const DEFAULT_VIDEO_ID = "dfnCAmr569k";

const DEFAULT_LYRICS = `
`;

const STORE_VAR = {
  SONG: "store_song",
  YOUTUBE: "store_youtube",
  LYRICS: "store_lyrics",
  HAPPI: "store_happi",
  MODE: "mode"
};

const HAPPI_OBJ = {
  API_LYRICS: "api_lyrics",
  RESULT: "result",
  LENGTH: "length",
  COVER: "cover",
  HAS_LYRICS: "haslyrics",
  TRACK: "track"
};

const EXT_COMM = {
  GET_LYRICS: "get-lyrics",
  GET_VIDEO_ID: "get-video-id",
  SPOTIFY: "spotify",
  CHANGE_MEDIA: "change-media",
  RENDER: "render-store-modified"
};

export {
  MODE,
  ID,
  CONTROLS,
  DISPLAY_MODE,
  DEFAULT_LYRICS,
  DEFAULT_VIDEO_ID,
  STORE_VAR,
  HAPPI_OBJ,
  EXT_COMM
};
