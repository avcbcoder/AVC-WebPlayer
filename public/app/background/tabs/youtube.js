/*global chrome */
const startYoutubeMiniMode = videoId => {
  chrome.windows.create(
    {
      type: "panel",
      focused: true,
      width: 470,
      height: 440,
      url: `https://www.youtube.com/watch?v=${videoId}`
    },
    function(window) {
      chrome.extension
        .getBackgroundPage()
        .console.log("created window", window);
    }
  );
  chrome.app.window.create("window.html", {
    alwaysOnTop: true,
    outerBounds: {
      width: 560,
      height: 315
    }
  });
  chrome.windows.create({ url: "https://www.youtube.com/watch?v=V2hlQkVJZhE" });
};

export default startYoutubeMiniMode;
