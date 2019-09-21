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

function startYoutubeMiniMode(songDetails,videoId) {
  console.log("Sending request for yt mini mode")
  chrome.runtime.sendMessage({
    type: EXT_COMM.YOUTUBE_MINI_MODE,
    data:songDetails,
    videoId
  });
}

export { changeMedia, getLyrics, getVideoId, getHappiData, startYoutubeMiniMode };
