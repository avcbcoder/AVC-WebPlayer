const STORE_VAR = {
  SONG: "store_song",
  YOUTUBE: "store_youtube",
  LYRICS: "store_lyrics",
  HAPPI: "store_happi",
  MODE: "mode"
};

const CACHE_VAR = {
  LYRICS: "cache_lyrics",
  VIDEO: "cache_video",
  HAPPI: "cache_happi"
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

const EXT_COMM={
  GET_LYRICS:'get-lyrics',
  GET_VIDEO_ID:'get-video-id',

}

const YOUTUBE_V3_SEARCH = `https://www.googleapis.com/youtube/v3/search`;

export { STORE_VAR, CACHE_VAR, YOUTUBE_V3_SEARCH, HAPPI_OBJ, EXT_COMM };
