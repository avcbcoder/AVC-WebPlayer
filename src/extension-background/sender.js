/*global chrome*/

function changeMedia(media) {
  chrome.runtime.sendMessage({
    type: "change-media",
    button: media
  });
}

function getLyrics(songDetails) {
  chrome.runtime.sendMessage({
    type: "get-lyrics",
    data: songDetails
  });
}

function getVideoId(songDetails) {
  chrome.runtime.sendMessage({
    type: "get-video-id",
    data: songDetails
  });
}

export { changeMedia, getLyrics, getVideoId };
