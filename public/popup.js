/* global chrome */
window.onload = () => {
    let url = ''
    chrome.storage.local.get(['url'], function (result) {
        chrome.extension.getBackgroundPage().console.log('current url', result);
        url = result.url
        chrome.extension.getBackgroundPage().console.log('hanji', url)
        //show popup
        if (url.includes('chrome://') || url.includes('chrome-search://') || url.includes('chrome-extension://')) {
            chrome.extension.getBackgroundPage().console.log('default choice', url)
        } else { // disable popup
            chrome.extension.getBackgroundPage().console.log('my choice', url)
            chrome.runtime.sendMessage({
                type: "toggle", options: {
                    type: "basic"
                }
            });
            window.close()
        }
    });
}