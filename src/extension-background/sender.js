/*global chrome*/
import { EXT_COMM } from "../constants";

function changeMedia(media) {
  chrome.runtime.sendMessage({
    type: EXT_COMM.CHANGE_MEDIA,
    button: media
  });
}

function getHappiData(songDetails) {
  chrome.runtime.sendMessage({
    type: EXT_COMM.GET_HAPPI_DATA,
    data: songDetails
  });
}

function getLyrics(songDetails) {
  chrome.runtime.sendMessage({
    type: EXT_COMM.GET_LYRICS,
    data: songDetails
  });
}

function getVideoId(songDetails) {
  chrome.runtime.sendMessage({
    type: EXT_COMM.GET_VIDEO_ID,
    data: songDetails
  });
}

function startYoutubeMiniMode(videoId) {
  chrome.runtime.sendMessage({
    type: EXT_COMM.YOUTUBE_MINI_MODE,
    videoId
  });
}

export { changeMedia, getLyrics, getVideoId, getHappiData, startYoutubeMiniMode };
