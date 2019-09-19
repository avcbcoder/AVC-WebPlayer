/* global chrome */
window.onload = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    let url = "";
    if (tabs && tabs.length > 0) url = tabs[0].url;
    if (
      url.includes("chrome://") ||
      url.includes("chrome-search://") ||
      url.includes("chrome-extension://") ||
      url.includes("chrome-error://chromewebdata/")
    ) {
    } else {
      // disable popup
      chrome.runtime.sendMessage({
        type: "toggle",
        options: {
          type: "basic"
        }
      });
      window.close();
    }
  });
};
