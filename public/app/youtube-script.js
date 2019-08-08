// var interval = null;

// console.log('hello');

// tryPictureInPicture = () => {
//     console.log('trying picture in picture')
//     const videos = document.getElementsByTagName('video')
//     if (videos.length > 0) {
//         console.log('found')
//         videos[0].requestPictureInPicture();
//         clearInterval(interval)
//     }
// }

// window.onload = () => {
//     console.log('clicking your video')
//     if (document.getElementsByTagName('video').length > 0) {
//         tryPictureInPicture();
//         return;
//     }
//     document.getElementsByClassName('ytp-large-play-button')[0].click();
//     console.log(432, document.getElementsByClassName('ytp-large-play-button'))
//     interval = setInterval(() => {
//         tryPictureInPicture();
//     }, 1000);
// }
