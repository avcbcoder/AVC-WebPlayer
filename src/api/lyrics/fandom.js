import $ from 'jquery';

const replace = (str, a, b) => {
    return str.split(a).join(b)
}

const getFandomLyrics = (track, artist, successCallback, failureCallback) => {
    track = track.trim().toLowerCase()
    artist = artist.trim().toLowerCase()
    const fandomURL = `https://lyrics.fandom.com/wiki/${artist}:${track}`
    $.ajax({
        url: fandomURL, success: function (htmlData) {
            const doc = new DOMParser().parseFromString(htmlData, "text/html");
            const lyricBox = doc.body.getElementsByClassName('lyricbox')[0]
            let lyrics = []
            const allText = (ele) => {
                ele.childNodes.forEach((val, idx) => {
                    console.log((val.nodeName.toString().toLowerCase()))
                    if (val.nodeName.toString().toLowerCase() === '#text')
                        lyrics.push(val ? val.data ? replace(val.data, '\n', '') : '' : '')
                    else if (val.nodeName.toString().toLowerCase() === 'br')
                        lyrics.push('\n')
                    else allText(val)
                });
            }
            allText(lyricBox)
            successCallback(lyrics.join(''))
        },
        statusCode: {
            404: function () { failureCallback() }
        },
        error: function () { failureCallback() },
        fail: function () { failureCallback() },
    });
}

export { getFandomLyrics }