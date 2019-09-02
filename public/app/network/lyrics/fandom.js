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

const getFandomLyrics = (track, artist, successCallback, failureCallback) => {
    track = filter(track.toLowerCase(), '_')
    artist = filter(artist.toLowerCase(), '_')
    const fandomURL = `https://lyrics.fandom.com/wiki/${artist}:${track}`
    $.ajax({
        url: fandomURL, success: function (htmlData) {
            const doc = new DOMParser().parseFromString(htmlData, "text/html");
            const lyricBox = doc.body.getElementsByClassName('lyricbox')[0]
            let lyrics = []
            const allText = (ele) => {
                ele.childNodes.forEach((val, idx) => {
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
            404: function () { failureCallback(); }
        },
        error: function () { failureCallback() },
        fail: function () { failureCallback() },
    });
}

export { getFandomLyrics }