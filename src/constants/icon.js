const getAllIcons = (chrome) => {
    const playIcon = chrome.runtime.getURL("img/play.png")
    const pauseIcon = chrome.runtime.getURL("img/pause.png")
    const prevIcon = chrome.runtime.getURL("img/prev.png")
    const nextIcon = chrome.runtime.getURL("img/next.png")
    const gifPause1 = chrome.runtime.getURL("img/gif-pause-1.png")
    const gifPause2 = chrome.runtime.getURL("img/gif-pause-2.png")
    const gifPlay = chrome.runtime.getURL("img/music_gif.gif")
    const shuffleIcon = chrome.runtime.getURL("img/shuffle.png")
    const repeatIcon = chrome.runtime.getURL("img/repeat.png")
    const menuIcon = chrome.runtime.getURL("img/menu_ham.png")
    const closeIcon = chrome.runtime.getURL("img/close.png")
    const closeWhiteThinIcon = chrome.runtime.getURL("img/cancel.png")
    const minimizeIcon = chrome.runtime.getURL("img/minimize.png")
    const menuWhiteIcon = chrome.runtime.getURL("img/menu_white.png")
    const closeWhiteIcon = chrome.runtime.getURL("img/close_white.png")
    const ytBkg1 = chrome.runtime.getURL("img/yt-bkg-1.svg")
    const ytBkg2 = chrome.runtime.getURL("img/yt-bkg-1.png")

    return {
        playIcon, prevIcon, nextIcon, gifPause1, gifPause2, shuffleIcon, gifPlay, repeatIcon,
        menuIcon, closeIcon, pauseIcon, menuWhiteIcon, closeWhiteIcon, closeWhiteThinIcon, minimizeIcon,
        ytBkg1, ytBkg2
    }
}

export { getAllIcons }