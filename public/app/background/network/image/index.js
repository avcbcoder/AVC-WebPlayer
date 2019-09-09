import WALLPAPER_ALPHA_CODER_API_KEYS from "../../../../config.js";

const getImageFromUrl = url => {
  $.ajax({
    url:"https://images7.alphacoders.com/905/905837.jpg",
    success: function(response) {
      chrome.extension.getBackgroundPage().console.log("response=>", response);
    },
    statusCode: {
      404: function() {}
    },
    error: function() {},
    fail: function() {}
  });
};

export { getImageFromUrl };
