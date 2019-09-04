/*global chrome*/

var BUFFER_TIME = 500;

var songDetailsObj = {
  title: "",
  artist: [],
  albumArt: "",
  progressTime: "0:00",
  totalTime: "3:51",
  playing: false,
  time: new Date().getTime()
};

var spotifyPageElements = {};

function main() {
  const songArtist = [];
  const artistLinks = spotifyPageElements.rootText.childNodes[1].getElementsByTagName(
    "a"
  );
  for (let i = 0; i < artistLinks.length; i++)
    songArtist.push(artistLinks[i].innerText);

  return {
    title: spotifyPageElements.songTitle
      ? spotifyPageElements.songTitle.innerText
      : "",
    artist: songArtist ? songArtist : [],
    albumArt: spotifyPageElements.rootAlbum
      ? spotifyPageElements.rootAlbum.style.backgroundImage.split(`"`)[1]
      : "",
    playing:
      spotifyPageElements.play.getAttribute("title").toLowerCase() === "pause",
    progressTime: spotifyPageElements.progress[0].innerText,
    totalTime: spotifyPageElements.progress[1].innerText
  };
}

function extractElements() {
  // Details
  spotifyPageElements.rootDetails = document.getElementsByClassName(
    "now-playing"
  )[0];
  spotifyPageElements.rootText = spotifyPageElements.rootDetails.getElementsByClassName(
    "track-info"
  )[0];
  spotifyPageElements.songTitle = spotifyPageElements.rootText.childNodes[0].getElementsByTagName(
    "a"
  )[0];
  spotifyPageElements.rootAlbum = spotifyPageElements.rootDetails.getElementsByClassName(
    "cover-art-image"
  )[0];
  spotifyPageElements.artistLinks = spotifyPageElements.rootText.childNodes[1].getElementsByTagName(
    "a"
  );

  // Buttons
  const mediaButtons = document.getElementsByClassName("player-controls")[0]
    .childNodes[0];
  spotifyPageElements.shuffle = mediaButtons.childNodes[0];
  spotifyPageElements.previous = mediaButtons.childNodes[1];
  spotifyPageElements.play = mediaButtons.childNodes[2];
  spotifyPageElements.next = mediaButtons.childNodes[3];
  spotifyPageElements.repeat = mediaButtons.childNodes[4];

  // Progress
  spotifyPageElements.progress = document.getElementsByClassName(
    "playback-bar__progress-time"
  );

  // PictureInPicture
  spotifyPageElements.pip = document.getElementsByClassName(
    "picture-in-picture-button control-button"
  )[0];
}

extractElements();

if (window.location.href.includes("open.spotify.com")) {
  setInterval(() => {
    const newDetailsObj = main();
    const lastProgress =
      60 * parseInt(songDetailsObj.progressTime.split(":")[0], 10) +
      parseInt(songDetailsObj.progressTime.split(":")[1], 10);
    const newProgress =
      60 * parseInt(newDetailsObj.progressTime.split(":")[0], 10) +
      parseInt(newDetailsObj.progressTime.split(":")[1], 10);

    const isDiffArtist = (a, b) => {
      if (a.length !== b.length) return true;
      for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return true;
      return false;
    };

    if (
      newDetailsObj.title !== songDetailsObj.title ||
      isDiffArtist(newDetailsObj.artist, songDetailsObj.artist)
    ) {
      // fire event that song is changed
      chrome.runtime.sendMessage({
        type: "spotify",
        method: "song-change",
        data: newDetailsObj
      });
    } else if (newDetailsObj.albumArt !== songDetailsObj.albumArt) {
      chrome.runtime.sendMessage({
        type: "spotify",
        method: "album-art-change",
        data: newDetailsObj
      });
    } else if (Math.abs(newProgress - lastProgress > 2)) {
      // fire event that progress is changed
      chrome.runtime.sendMessage({
        type: "spotify",
        method: "progress-change",
        data: newDetailsObj
      });
    } else if (songDetailsObj.playing !== newDetailsObj.playing) {
      // fire event that play-state-changed
      chrome.runtime.sendMessage({
        type: "spotify",
        method: "play-state-change",
        data: newDetailsObj
      });
    }
    songDetailsObj = newDetailsObj;
  }, BUFFER_TIME);
}
