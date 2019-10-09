/*global MediaMetadata*/
import { ID, CONTROLS } from "../../constants";
import { changeMedia } from "../../extension-background/sender";

function initiallizeNavigator() {
//   navigator.mediaSession = navigator.mediaSession || {};
//   navigator.mediaSession.setActionHandler =
//     navigator.mediaSession.setActionHandler || function() {};
//   window.MediaMetadata = window.MediaMetadata || function() {};

  window.navigator.mediaSession.setActionHandler("previoustrack", function() {
    console.log('> User clicked "Previous Track" icon.');
    changeMedia(CONTROLS.PREV);
  });

  window.navigator.mediaSession.setActionHandler("nexttrack", function() {
    console.log('> User clicked "Next Track" icon.');
    changeMedia(CONTROLS.NEXT);
  });

  window.navigator.mediaSession.setActionHandler("play", function() {
    console.log('> User clicked "Play" icon.');
    changeMedia(CONTROLS.PLAY);
    playAudio();
  });

  window.navigator.mediaSession.setActionHandler("pause", function() {
    console.log('> User clicked "Pause" icon.');
    changeMedia(CONTROLS.PLAY);
    pauseAudio();
  });
}

function addMediaButtonSupport() {
  if (document.getElementById(ID.AUDIO.SPOTIFY)) return;
  initiallizeNavigator();
  const audio = document.createElement("audio");
  audio.id = ID.AUDIO.SPOTIFY;
  audio.src =
    "https://storage.googleapis.com/media-session/sintel/snow-fight.mp3";
  audio.volume = 0.0;
  audio.addEventListener("ended", function() {
    playAudio();
  });
  document.body.appendChild(audio);
}

function playAudio() {
  const audio = document.getElementById(ID.AUDIO.SPOTIFY);
  if (audio) {
    audio.volume = 0.0;
    audio
      .play()
      .then(_ => updateMetadata())
      .catch(error => console.log(error));
  }
}
function pauseAudio() {
  const audio = document.getElementById(ID.AUDIO.SPOTIFY);
  if (audio) audio.pause();
}

function startPip() {
  playAudio();
}

function stopPip() {
  pauseAudio();
}

function updateMetadata() {
  const art = [];
  const sizes = [96, 128, 192, 256, 384, 512];
  const imgsrc =
    "https://storage.googleapis.com/media-session/sintel/artwork-96.png";
  sizes.forEach(size => {
    art.push({ src: imgsrc, sizes: `${size}x${size}`, type: "image/png" });
  });
  window.navigator.mediaSession.metadata = new window.MediaMetadata({
    title: "Ye mera title hai",
    artist: "artist ka name",
    album: "album ka name",
    artwork: art
  });
}

export { addMediaButtonSupport, startPip, stopPip };
