import $ from 'jquery';

const getFandomLyrics = (track, artist) => {
    const fandomURL = `https://lyrics.fandom.com/wiki/${artist}:${track}`
    $.ajax({
        url: fandomURL, success: function (htmlData) {
            const doc = new DOMParser().parseFromString(htmlData, "text/html");
            const lyricBox = doc.body.getElementsByClassName('lyricbox')[0]
            let lyrics = []
            console.log(lyricBox)
            lyricBox.childNodes.forEach((val, idx) => {
                console.log((val.nodeName.toString().toLowerCase()))
                if (!(val.nodeName.toString().toLowerCase() === 'br'))
                    lyrics.push(val ? val.data ? val.data : '' : '')
                else
                    lyrics.push('\n')
            });
            console.log(lyrics.join(''))
        }
    });
}

export { getFandomLyrics }