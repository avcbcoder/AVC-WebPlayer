import $ from 'jquery';

const replace = (str, a, b) => {
    return str.split(a).join(b)
}

const getAzLyrics = (track, artist, successCallback, failureCallback) => {
    track = track ? replace(track.substr(0, track.indexOf('(')).trim(), ' ', '').toLowerCase() : ''
    artist = artist ? replace(artist, ' ', '').toLowerCase() : ''
    const azURL = `https://www.azlyrics.com/lyrics/${artist}/${track}.html`
    $.ajax({
        url: azURL,
        success: function (htmlData) {
            const doc = new DOMParser().parseFromString(htmlData, "text/html");
            const ringtone = doc.body.getElementsByClassName('ringtone')[0]
            const sibling = ringtone.parentElement.childNodes

            let lyricBox = document.createElement('div')
            for (let i = 0; i < sibling.length; i++) {
                if (sibling[i].childNodes.length > lyricBox.childNodes.length)
                    lyricBox = sibling[i]
            }
            let lyrics = []
            lyricBox.childNodes.forEach((val, idx) => {
                if (val.nodeName.toString().toLowerCase() === '#text')
                    lyrics.push(val ? val.data ? replace(val.data, '\n', '') : '' : '')
                if (val.nodeName.toString().toLowerCase() === 'br')
                    lyrics.push('\n')
            });
            successCallback(replace(lyrics.join(''), '\n\n\n', '\n\n'))
        },
        statusCode: {
            404: function () { failureCallback() }
        },
        error: function () { failureCallback() },
        fail: function () { failureCallback() },
    });
}

export { getAzLyrics }