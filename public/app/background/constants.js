const STORE_VAR = {
  SONG: "store_song",
  YOUTUBE: "store_youtube",
  LYRICS: "store_lyrics",
  HAPPI: "store_happi",
  MODE: "mode",
  ALPHA:"alpha"
};

const CACHE_VAR = {
  LYRICS: "cache_lyrics",
  VIDEO: "cache_video",
  HAPPI: "cache_happi",
  ALPHA: "cache_happi"
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
  YOUTUBE_MINI_MODE: "start-youtube-mini-moe"
};

const API_STATE = {
  IDLE: "idle",
  FETCHING: "fetching",
  SUCCESS: "success",
  FAIL: "fail"
};

const VALID_REQ_TYPE = "change-media get-video-id spotify get-lyrics";

const YOUTUBE_V3_SEARCH = `https://www.googleapis.com/youtube/v3/search`;

export {
  STORE_VAR,
  CACHE_VAR,
  YOUTUBE_V3_SEARCH,
  HAPPI_OBJ,
  EXT_COMM,
  VALID_REQ_TYPE,
  API_STATE
};
