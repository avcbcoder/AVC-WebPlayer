import { ID } from "../../constants";

function initiallizeNavigator() {
  navigator.mediaSession = navigator.mediaSession || {};
  navigator.mediaSession.setActionHandler =
    navigator.mediaSession.setActionHandler || function() {};
  window.MediaMetadata = window.MediaMetadata || function() {};

  navigator.mediaSession.setActionHandler("previoustrack", function() {
    console.log('> User clicked "Previous Track" icon.');
  });

  navigator.mediaSession.setActionHandler("nexttrack", function() {
    console.log('> User clicked "Next Track" icon.');
  });

  audio.addEventListener("ended", function() {
    playAudio();
  });

  navigator.mediaSession.setActionHandler("play", function() {
    console.log('> User clicked "Play" icon.');
    audio.play();
  });

  navigator.mediaSession.setActionHandler("pause", function() {
    console.log('> User clicked "Pause" icon.');
    audio.pause();
  });
}

function addMediaButtonSupport() {
  if (document.getElementById(ID.AUDIO.SPOTIFY)) return;
  const audio = document.createElement("audio");
  audio.id = ID.AUDIO.SPOTIFY;
  audio.src =
    "https://storage.googleapis.com/media-session/sintel/snow-fight.mp3";
  audio.volume = 0.0;
}

function startPip() {
  const audio = document.getElementById();
  audio
    .play()
    .then(_ => updateMetadata())
    .catch(error => console.log(error));
}

function stopPip(){
    
}

function updateMetadata() {
  const art = [];
  const sizes = [96, 128, 192, 256, 384, 512];
  const imgsrc =
    "https://storage.googleapis.com/media-session/sintel/artwork-96.png";
  sizes.forEach(size => {
    art.push({ src: imgsrc, sizes: `${size}x${size}`, type: "image/png" });
  });
  navigator.mediaSession.metadata = new MediaMetadata({
    title: "Ye mera title hai",
    artist: "artist ka name",
    album: "album ka name",
    artwork: art
  });
}
