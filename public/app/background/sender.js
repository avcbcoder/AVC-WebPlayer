import { EXT_COMM } from "./constants.js";

const render = request => {
  chrome.tabs.query({}, function(tabs) {
    // DO NOT SEND TO ALL TABS
    for (let i = 0; i < tabs.length; i++) {
      chrome.tabs.sendMessage(tabs[i].id, {
        type: EXT_COMM.RENDER,
        method: request.method
      });
    }
  });
};

export { render };
