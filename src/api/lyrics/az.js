import $ from 'jquery';

const replace = (str, a, b) => {
    //Method 1 
    return str.split(a).join(b)
    //Method 2 - using regular expression
}

const getAzLyrics = (track, artist) => {
    const azURL = `https://www.azlyrics.com/lyrics/beberexha/2soulsonfire.html`
    $.ajax({
        url: azURL, success: function (htmlData) {
            const doc = new DOMParser().parseFromString(htmlData, "text/html");
            const ringtone = doc.body.getElementsByClassName('ringtone')[0]
            const sibling = ringtone.parentElement.childNodes

            let lyricBox = document.createElement('div')
            for (let i = 0; i < sibling.length; i++) {
                if (sibling[i].childNodes.length > lyricBox.childNodes.length)
                    lyricBox = sibling[i]
            }
            let lyrics = []
            console.log(lyricBox)
            lyricBox.childNodes.forEach((val, idx) => {
                console.log((val.nodeName.toString().toLowerCase()))
                if (val.nodeName.toString().toLowerCase() === '#text')
                    lyrics.push(val ? val.data ? replace(val.data, '\n', '') : '' : '')
                if (val.nodeName.toString().toLowerCase() === 'br')
                    lyrics.push('\n')
            });
            console.log(replace(lyrics.join(''), '\n\n\n', '\n\n'))
        }
    });
}

export { getAzLyrics }