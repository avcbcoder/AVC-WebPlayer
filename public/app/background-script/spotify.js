/*global chrome*/

var mediaButtons = document.getElementsByClassName('player-controls')[0].childNodes[0]
var shuffle = mediaButtons.childNodes[0];
var previous = mediaButtons.childNodes[1];
var play = mediaButtons.childNodes[2];
var next = mediaButtons.childNodes[3];
var repeat = mediaButtons.childNodes[4];

var BUFFER_TIME = 500;

var songDetailsObj = {
    title: '',
    artist: [],
    albumArt: '',
    progressTime: '',
    totalTime: '',
    playing: '',
}

var spotifyPageElements = {}

function main() {
    const songArtist = []
    const artistLinks = spotifyPageElements.rootText.childNodes[1].getElementsByTagName('a')
    for (let i = 0; i < artistLinks.length; i++)
        songArtist.push(artistLinks[i].innerText)

    return {
        title: spotifyPageElements.songTitle ? spotifyPageElements.songTitle.innerText : '',
        artist: songArtist ? songArtist : [],
        albumArt: spotifyPageElements.rootAlbum ? spotifyPageElements.rootAlbum.style.backgroundImage.split(`"`)[1] : '',
        playing: spotifyPageElements.play.getAttribute('title').toLowerCase() === 'pause',
        progressTime: spotifyPageElements.progress[0].innerText,
        totalTime: spotifyPageElements.progress[1].innerText
    }
}

function extractElements() {
    // Details
    spotifyPageElements.rootDetails = document.getElementsByClassName('now-playing')[0]
    spotifyPageElements.rootText = spotifyPageElements.rootDetails.getElementsByClassName('track-info')[0]
    spotifyPageElements.songTitle = spotifyPageElements.rootText.childNodes[0].getElementsByTagName('a')[0]
    spotifyPageElements.rootAlbum = spotifyPageElements.rootDetails.getElementsByClassName('cover-art-image')[0]
    spotifyPageElements.artistLinks = spotifyPageElements.rootText.childNodes[1].getElementsByTagName('a')

    // Buttons
    const mediaButtons = document.getElementsByClassName('player-controls')[0].childNodes[0]
    spotifyPageElements.shuffle = mediaButtons.childNodes[0];
    spotifyPageElements.previous = mediaButtons.childNodes[1];
    spotifyPageElements.play = mediaButtons.childNodes[2];
    spotifyPageElements.next = mediaButtons.childNodes[3];
    spotifyPageElements.repeat = mediaButtons.childNodes[4];

    // Progress
    spotifyPageElements.progress = document.getElementsByClassName('playback-bar__progress-time');
}

extractElements();

// || songDetailsObj.progressTime !== newDetailsObj.progressTime
if (window.location.href.includes('open.spotify.com') && !window.set) {
    console.log('injecting into spotify')
    window.set = true;
    setInterval(() => {
        const newDetailsObj = main();
        if (newDetailsObj.title !== songDetailsObj.title
            || newDetailsObj.albumArt !== songDetailsObj.albumArt
            || songDetailsObj.playing !== newDetailsObj.playing) {
            songDetailsObj = newDetailsObj;
            chrome.runtime.sendMessage({
                type: "current-song-details", options: {
                    type: "basic",
                    songDetailsObj,
                }
            });
        }
    }, BUFFER_TIME);
}