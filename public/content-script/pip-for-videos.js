var pipUniqueIdHash = 78;
var loopId = "";

function mainScript() {
  const pipObj = {};

  const isFullScreen = () => {
    return (
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement
    );
  };

  const addPipFor = videos => {
    [].forEach.call(videos, video => {
      const pip = addPipButtonForVideo(video);
      updatePos(video, pip);
      pipObj[pipUniqueIdHash] = { video, pip };
      video.dataset.pipId = pipUniqueIdHash;
      // Update position on scroll
      window.addEventListener("scroll", () => {
        updatePos(video, pip);
      });
      // Update position when video size changes
      new ResizeObserver(() => {
        updatePos(video, pip);
      }).observe(video);
      pipUniqueIdHash++;
    });
  };

  const updatePos = (video, pip) => {
    if (isFullScreen()) {
      pip.style.display = "none";
      return;
    }
    const pos = video.getBoundingClientRect();
    if (
      (pos.y < 0 && pos.y + pos.height < 30) ||
      pos.y > window.innerHeight ||
      (pos.x < 0 && pos.x + pos.width < 150) ||
      pos.x > window.innerWidth
    ) {
      pip.style.display = "none";
      return;
    }
    pip.style.display = "flex";
    pip.style.left = `${Math.floor(pos.x < 0 ? 0 : pos.x + 8)}px`;
    pip.style.top = `${Math.floor(pos.y < 0 ? 0 : pos.y + 8)}px`;
  };

  function addPipButtonForVideo(video) {
    const div = document.createElement("div");
    div.classList.add("av-pip-button");
    document.body.appendChild(div);
    const style = div.style;
    style.width = "150px";
    style.height = "25px";
    style.position = "fixed";
    style.zIndex = "99999";
    style.backgroundColor = "#478ffc";
    style.borderRadius = "5px";
    style.color = "#fff";
    style.textAlign = "center";
    style.fontSize = "16px";
    style.cursor = "pointer";
    style.display = "flex";
    style.justifyContent = "center";
    style.justifyItems = "center";
    style.flexDirection = "column";
    style.opacity = "0.6";
    div.innerText = "Start mini mode";

    div.addEventListener("mouseover", () => {
      div.style.boxShadow = "3px 3px 8px #478ffc";
      div.style.opacity = "1";
    });

    div.addEventListener("mouseout", () => {
      div.style.boxShadow = "";
      div.style.opacity = "0.6";
    });

    div.addEventListener("click", () => {
      div.innerText = "Stop Mini Mode";
      if (document.pictureInPictureElement) document.exitPictureInPicture();
      else video.requestPictureInPicture();
    });

    if (video)
      video.addEventListener("leavepictureinpicture", () => {
        div.innerText = "Start Mini Mode";
      });

    return div;
  }

  const togglePipButtons = () => {
    for (let pipId in pipObj) {
      const { pip } = pipObj[pipId];
      if (pip && pip.style)
        pip.style.display = isFullScreen() ? "none" : "flex";
    }
  };

  const looper = () => {
    const intervalId = setInterval(() => {
      // filter on already added pips
      for (let pipId in pipObj) {
        const { pip, video } = pipObj[pipId];
        const posInfo = video ? video.getBoundingClientRect() : null;
        const videoExist = posInfo
          ? posInfo.width > 200 && posInfo.height > 200
          : null;
        if (!videoExist && pip && pip.parentElement) {
          pip.parentElement.removeChild(pip);
          delete pipObj[pipId];
        }
      }
      // find and filter videos
      let videos = document.getElementsByTagName("video");

      videos = [].filter.call(videos, video => {
        const posInfo = video.getBoundingClientRect();
        const pipId = video.dataset.pipId;
        return (
          !(pipId in pipObj) && posInfo.width > 200 && posInfo.height > 200
        );
      });

      if (videos.length > 0 && !document.pictureInPictureElement)
        addPipFor(videos);
    }, 2000);
    return intervalId;
  };

  // start the looper when dom loads
  window.onload = () => {
    loopId = looper();
  };

  // listener for tab change => restart looper if tab state becomes active
  document.addEventListener("visibilitychange", () => {
    clearInterval(loopId);
    if (!document.hidden) loopId = looper();
  });

  // hide all pip buttons if dom is in full screen state
  document.addEventListener("fullscreenchange", togglePipButtons, false);
}

mainScript();
