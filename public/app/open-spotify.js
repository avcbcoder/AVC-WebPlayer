function main() {
    const rootDetails = document.getElementsByClassName('now-playing')[0]
    const rootText = rootDetails.getElementsByClassName('track-info')[0]
    const songTitle = rootText.childNodes[0].getElementsByTagName('a')[0].innerText
    console.log("found this song", songTitle)
    chrome.runtime.sendMessage({
        type: "details", options: {
            type: "basic",
            title: songTitle,
        }
    });
}

main();