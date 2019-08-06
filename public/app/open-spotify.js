function main() {
    const rootDetails = document.getElementsByClassName('now-playing')[0]
    const rootText = rootDetails.getElementsByClassName('track-info')[0]
    const songTitle = rootText.childNodes[0].getElementsByTagName('a')[0].innerText
    console.log("found this song", songTitle)

    return {
        title: songTitle,
        artist: ''
    }
}

var songDetailsObj = {
    title: '',
    artist: [],
    albumArt: '',
}

setInterval(() => {
    const newDetailsObj = main();
    console.log(newDetailsObj)
    if (newDetailsObj.title !== songDetailsObj.title) {
        songDetailsObj = newDetailsObj;
        chrome.runtime.sendMessage({
            type: "current-song-details", options: {
                type: "basic",
                songDetailsObj,
            }
        });
    }
}, 2000);
