function main() {
    const rootDetails = document.getElementsByClassName('now-playing')[0]
    const rootText = rootDetails.getElementsByClassName('track-info')[0]
    const songTitle = rootText.childNodes[0].getElementsByTagName('a')[0]
    const rootAlbum = rootDetails.getElementsByClassName('cover-art-image')[0]
    const songArtist = []
    const artistLinks = rootText.childNodes[1].getElementsByTagName('a')
    for (let i = 0; i < artistLinks.length; i++)
        songArtist.push(artistLinks[i].innerText)

    return {
        title: songTitle ? songTitle.innerText : '',
        artist: songArtist ? songArtist : [],
        albumArt: rootAlbum ? rootAlbum.style.backgroundImage : ''
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
    if (newDetailsObj.title !== songDetailsObj.title || newDetailsObj.albumArt !== songDetailsObj.albumArt) {
        songDetailsObj = newDetailsObj;
        chrome.runtime.sendMessage({
            type: "current-song-details", options: {
                type: "basic",
                songDetailsObj,
            }
        });
    }
}, 2000);
