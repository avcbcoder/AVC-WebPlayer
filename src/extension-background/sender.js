/*global chrome*/
import {EXT_COMM} from '../constants'

function changeMedia(media) {
  chrome.runtime.sendMessage({
    type: EXT_COMM.CHANGE_MEDIA,
    button: media
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

export { changeMedia, getLyrics, getVideoId };
