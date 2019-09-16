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

const MINI_MODE = {
  none: "none",
  spotify: "spotify",
  youtube: "youtube",
  lyrics: "lyrics"
};

const ID = {
  YOUTUBE_IFRAME: "yt_401",
  EXTENSION_BODY: "extension-body",
  EXTENSION_PLAYER: "extension-player",
  CANVAS: {
    SPOTIFY: "id-spotify-canvas",
    LYRICS: "id-lyrics-canvas"
  },
  VIDEO: {
    SPOTIFY: "id-spotify-video",
    LYRICS: "id-lyrics-video"
  },
  WINDOW: {
    SPOTIFY: "id-spotify-window",
    LYRICS: "id-lyrics-window"
  },
  FRAME: {
    SPOTIFY: "id-spotify-frame",
    LYRICS: "id-lyrics-frame"
  },
  COMP: {
    SPOTIFY: "id-spotify-comp",
    LYRICS: "id-lyrics-comp"
  }
};

const DEFAULT_STORE = {
  mode: MODE.MODE_SPOTIFY,
  store_song: {
    title: "",
    artist: [],
    albumArt: "",
    progressTime: "0:00",
    totalTime: "3:51",
    playing: ""
  },
  store_lyrics: {
    state: "",
    response: ""
  },
  store_youtube: {
    state: "",
    response: ""
  },
  store_happi: {
    state: "",
    response: ""
  }
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
  MODE: "mode",
  ALPHA: "alpha"
};

const HAPPI_OBJ = {
  API_LYRICS: "api_lyrics",
  RESULT: "result",
  LENGTH: "length",
  COVER: "cover",
  HAS_LYRICS: "haslyrics",
  TRACK: "track",
  LYRICS: "lyrics"
};

const EXT_COMM = {
  GET_LYRICS: "get-lyrics",
  GET_VIDEO_ID: "get-video-id",
  GET_HAPPI_DATA: "get-happi-data",
  SPOTIFY: "spotify",
  CHANGE_MEDIA: "change-media",
  RENDER: "render-store-modified",
  YOUTUBE_MINI_MODE: "start-youtube-mini-mode"
};

const API_STATE = {
  IDLE: "idle",
  FETCHING: "fetching",
  SUCCESS: "success",
  FAIL: "fail"
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
  EXT_COMM,
  API_STATE,
  MINI_MODE,
  DEFAULT_STORE
};
