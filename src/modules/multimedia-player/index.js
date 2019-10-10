import { ID, CONTROLS } from "../../constants";
import { changeMedia } from "../../extension-background/sender";

/**
 * Even after adding the multimedia action handler, they will not work until:
 * 1. user guesture is registered 
 * 2. A media from the webpage is played
 * 
 * Play/Pause Action ---------------------------
 * The Play/Pause multimedia action is different from previous/next mm action handler
 * since they dont requeire the info of playback state i.e whether media is playing or not
 * The playbackState attribute is specified from the declared playback state or guessed playback state from the browsing context.
 * By default playback state = "none", and guess playback state is calculated using browsing context.
 * So, in case of multiple media(audio/video) elements in webpage, u need to pause every element when pause action is fired.
 */

function initiallizeNavigator() {
  window.navigator.mediaSession.setActionHandler("previoustrack", function() {
    changeMedia(CONTROLS.PREV);
  });
  window.navigator.mediaSession.setActionHandler("nexttrack", function() {
    changeMedia(CONTROLS.NEXT);
  });
  window.navigator.mediaSession.setActionHandler("play", function() {
    changeMedia(CONTROLS.PLAY);
    playMedia();
  });
  window.navigator.mediaSession.setActionHandler("pause", function() {
    changeMedia(CONTROLS.PLAY);
    pauseMedia();
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
    playMedia();
  });
  document.body.appendChild(audio);
}

function playMedia() {
  const audio = document.getElementById(ID.AUDIO.SPOTIFY);
  if (audio) {
    audio.volume = 0.0;
    audio.play();
  }
  const video = document.getElementById(ID.VIDEO.SPOTIFY);
  if (video) video.play();
}

function pauseMedia() {
  const audio = document.getElementById(ID.AUDIO.SPOTIFY);
  if (audio) audio.pause();
  const video = document.getElementById(ID.VIDEO.SPOTIFY);
  if (video) video.pause();
}

function handleMultimediaAudio(songPlaying) {
  if (songPlaying) {
    playMedia();
  } else {
    playMedia();
    pauseMedia();
  }
}

export { addMediaButtonSupport, handleMultimediaAudio };
