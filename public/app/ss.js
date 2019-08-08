var interval = null;
console.log('inside of spotify')

tryPictureInPicture = () => {
    // window.focus();
    console.log('trying picture in picture')
    document.body.click();
    document.getElementsByClassName('view-count')[0].click();
    chrome.storage.local.get(['url'], function (result) {
        console.log('Value currently is ' + result.key, result);
    });

    const videos = document.getElementsByTagName('video')
    if (videos.length > 0) {
        videos[0].focus();
        console.log('found')
        try {
            // document.getElementsByClassName('ytp-large-play-button')[0].click();
            videos[0].requestPictureInPicture();
        } catch (e) {
            console.log(e)
        }
    }
}

if (window.location.href.includes('www.youtube.com/watch?')) {
    document.body.style.display = "none"
    console.log('inside of youtube')
    window.onload = () => {
        console.log('clicking your video')
        // document.getElementsByClassName('ytp-large-play-button')[0].click();
        // console.log(432, document.getElementsByClassName('ytp-large-play-button'))
        setInterval(() => {
            tryPictureInPicture();
        }, 1000);
    }
    // document.addEventListener("DOMContentLoaded", function (event) {
    // console.log('clicking your video')
    // document.getElementsByClassName('ytp-large-play-button')[0].click();
    // console.log(432, document.getElementsByClassName('ytp-large-play-button'))
    // interval = setInterval(() => {
    //     tryPictureInPicture();
    // }, 1000);
    // });
}