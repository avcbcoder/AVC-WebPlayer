/* global chrome */
window.onload = () => {
    let url = ''
    chrome.storage.local.get(['url'], function (result) {
        chrome.extension.getBackgroundPage().console.log('current url', result);
        url = result.url
        //show popup
        if (url.includes('chrome://') || url.includes('chrome-search://') || url.includes('chrome-extension://' || url.includes("chrome-error://chromewebdata/"))) {
        } else { // disable popup
            chrome.runtime.sendMessage({
                type: "toggle", options: {
                    type: "basic"
                }
            });
            window.close()
        }
    });
}