/*global MediaMetadata*/
import { ID, CONTROLS } from "../../constants";
import { changeMedia } from "../../extension-background/sender";

function initiallizeNavigator() {
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
    audio.play();
  }
  const video = document.getElementById(ID.VIDEO.SPOTIFY);
  if (video) video.play();
}

function pauseAudio() {
  const audio = document.getElementById(ID.AUDIO.SPOTIFY);
  if (audio) audio.pause();
  const video = document.getElementById(ID.VIDEO.SPOTIFY);
  if (video) video.pause();
}

function handleMultimediaAudio(songPlaying){
    if(songPlaying){
        playAudio();
    }else{
        pauseAudio();
    }
}

export { addMediaButtonSupport, handleMultimediaAudio };



// /*global MediaMetadata*/
// import { ID, CONTROLS } from "../../constants";
// import { changeMedia } from "../../extension-background/sender";

// function initiallizeNavigator() {
//   window.navigator.mediaSession.setActionHandler("previoustrack", function() {
//     console.log('> User clicked "Previous Track" icon.');
//     // changeMedia(CONTROLS.PREV);
//   });

//   window.navigator.mediaSession.setActionHandler("nexttrack", function() {
//     console.log('> User clicked "Next Track" icon.');
//     // changeMedia(CONTROLS.NEXT);
//   });

//   window.navigator.mediaSession.setActionHandler("play", function() {
//     console.log('> User clicked "Play" icon.');
//     // changeMedia(CONTROLS.PLAY);
//     playAudio();
//   });

//   window.navigator.mediaSession.setActionHandler("pause", function() {
//     console.log('> User clicked "Pause" icon.');
//     // changeMedia(CONTROLS.PLAY);
//     pauseAudio();
//   });
// }

// function addMediaButtonSupport() {
//   if (document.getElementById(ID.AUDIO.SPOTIFY)) return;
//   initiallizeNavigator();
//   const audio = document.createElement("audio");
//   audio.id = ID.AUDIO.SPOTIFY;
//   audio.src =
//     "https://storage.googleapis.com/media-session/sintel/snow-fight.mp3";
//   audio.volume = 0.0;
//   audio.addEventListener("ended", function() {
//     audio.pause();
//     playAudio();
//   });
//   document.body.appendChild(audio);
// }

// function playAudio() {
//   const audio = document.getElementById(ID.AUDIO.SPOTIFY);
//   const video = document.getElementById(ID.VIDEO.SPOTIFY);
//   if (audio && audio.paused) {
//     console.log("play called");
//     audio.volume = 0.0;
//     audio.play();
//     console.log("after play  ", audio.paused);
//     window.navigator.mediaSession.playbackState = "playing";
//   }
//   if (video) video.play();
// }

// function pauseAudio() {
//   const audio = document.getElementById(ID.AUDIO.SPOTIFY);
//   const video = document.getElementById(ID.VIDEO.SPOTIFY);
//   if (audio && !audio.paused) {
//     console.log("pause called");
//     audio.pause();
//     console.log("after pause  ", audio.paused);
//   }
//   if (video) video.pause();
// }

// function handleMultimediaAudio(songPlaying) {
//   if (songPlaying) {
//     playAudio();
//   } else {
//     pauseAudio();
//   }
// }

// export { addMediaButtonSupport, handleMultimediaAudio };
