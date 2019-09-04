/*global chrome*/

var BUFFER_TIME = 500;

var defaultDetails = {
  title: "",
  artist: [],
  albumArt: "",
  progressTime: "0:00",
  totalTime: "3:51",
  playing: false,
  time: new Date().getTime()
};

var songDetailsObj = defaultDetails;

function extractDetails() {
  const rootDetails = document.getElementsByClassName("now-playing")[0];
  if (!rootDetails) return defaultDetails;

  const rootText = rootDetails.getElementsByClassName("track-info")[0];
  const songTitle = rootText
    ? rootText.childNodes[0].getElementsByTagName("a")[0]
    : null;
  const rootAlbum = rootDetails
    ? rootDetails.getElementsByClassName("cover-art-image")[0]
    : null;
  const artistLinks = rootText
    ? rootText.childNodes[1].getElementsByTagName("a")
    : null;
  const progress = document.getElementsByClassName(
    "playback-bar__progress-time"
  );

  // extract play button
  const playerControls = document.getElementsByClassName("player-controls")[0];
  const mediaButtons = playerControls ? playerControls.childNodes[0] : null;
  const play = mediaButtons ? mediaButtons.childNodes[2] : null;

  const artists = [];
  if (artistLinks)
    artistLinks.forEach(link => {
      artists.push(link.innerText);
    });

  const getTimeInSec = time =>
    60 * parseInt(time.split(":")[0], 10) + parseInt(time.split(":")[1], 10);

  return {
    title: songTitle ? songTitle.innerText : "",
    artist: artists,
    albumArt: rootAlbum ? rootAlbum.style.backgroundImage.split(`"`)[1] : "",
    playing: play.getAttribute("title").toLowerCase() === "pause",
    progressTime: progress[0]
      ? getTimeInSec(progress[0].innerText)
      : getTimeInSec("0:00"),
    totalTime: progress[0]
      ? getTimeInSec(progress[1].innerText)
      : getTimeInSec("3:51"),
    time: new Date().getTime()
  };
}

if (window.location.href.includes("open.spotify.com")) {
  setInterval(() => {
    const newDetailsObj = extractDetails();
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
