import $ from 'jquery';

const replace = (str, a, b) => {
    return str.split(a).join(b)
}

const filter = (str, space) => {
    let track = []
    for (let i = 0; i < str.length; i++)
        if (str[i] === '(')
            break;
        else if (str[i] === ' ')
            track.push(space)
        else
            track.push((str[i] >= 'a' && str[i] <= 'z') || (str[i] >= '0' && str[i] <= '9') ? str[i] : '')
    return track.join('')
}


const getAzLyrics = (track, artist, successCallback, failureCallback) => {
    track = filter(track.toLowerCase(), '')
    artist = filter(artist.toLowerCase(), '')
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
            404: function () { failureCallback(); }
        },
        error: function () { failureCallback() },
        fail: function () { failureCallback() },
    });
}

export { getAzLyrics }