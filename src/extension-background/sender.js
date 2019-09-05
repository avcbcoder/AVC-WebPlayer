/*global chrome*/

function changeMedia(media) {
  chrome.runtime.sendMessage({
    type: "change-media",
    button: media
  });
}

function getLyrics() {
  chrome.runtime.sendMessage({
    type: "get-lyrics",
    button: media
  });
}

function getVideoId() {
  chrome.runtime.sendMessage({
    type: "get-video-id",
    button: media
  });
}

export { changeMedia, getLyrics, getVideoId };
