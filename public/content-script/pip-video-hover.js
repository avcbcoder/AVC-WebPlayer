function mainScript() {
  let pipUniqueIdHash = 78;
  let loopId = "";
  let lastMove = new Date().getTime();

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
      const pipId = video.dataset.pipId;
      if (pipId in pipObj) return;
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

  const togglePipButtons = () => {
    for (let pipId in pipObj) {
      const { pip } = pipObj[pipId];
      if (pip && pip.style && isFullScreen()) pip.style.opacity = 0;
    }
  };

  const updatePos = (video, pip) => {
    const pos = video.getBoundingClientRect();
    if (
      !(
        (pos.y < 0 && pos.y + pos.height < 30) ||
        pos.y > window.innerHeight ||
        (pos.x < 0 && pos.x + pos.width < 150) ||
        pos.x > window.innerWidth
      )
    ) {
      pip.style.left = `${Math.floor(pos.x < 0 ? 0 : pos.x + 8)}px`;
      pip.style.top = `${Math.floor(pos.y < 0 ? 0 : pos.y + 8)}px`;
    }
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
    style.opacity = "1";
    style.transition = "opacity 0.4s"; //animation
    div.innerText = "Start mini mode";

    div.addEventListener("click", () => {
      if (document.pictureInPictureElement) document.exitPictureInPicture();
      else video.requestPictureInPicture();
    });

    div.addEventListener("mouseover", () => {
      if (!isFullScreen()) div.style.opacity = 1;
    });

    if (video) {
      video.addEventListener("enterpictureinpicture", () => {
        div.innerText = "Stop Mini Mode";
      });
      video.addEventListener("leavepictureinpicture", () => {
        div.innerText = "Start Mini Mode";
      });
      // video.addEventListener("mouseover", () => {
      //   if (!isFullScreen()) div.style.opacity = 1;
      // });
      video.addEventListener("mouseout", () => {
        div.style.opacity = 0;
      });
      video.addEventListener("mousemove", () => {
        lastMove = new Date().getTime();
        if (!isFullScreen()) div.style.opacity = 1;
        setTimeout(() => {
          if (new Date().getTime() - lastMove > 2700) div.style.opacity = 0;
        }, 3000);
      });
    }

    return div;
  }

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
        } else {
          updatePos(video, pip);
        }
      }
      // find and filter videos
      let videos = document.getElementsByTagName("video");

      videos = [].filter.call(videos, video => {
        const posInfo = video.getBoundingClientRect();
        const pipId = video.dataset.pipId;
        const videoId = video.id;
        if (videoId && videoId === "id-spotify-video") return false;
        if (pipId in pipObj) return false;
        return posInfo.width > 200 && posInfo.height > 200;
      });
      if (videos.length > 0 && !document.pictureInPictureElement)
        addPipFor(videos);
    }, 3000);
    return intervalId;
  };

  // start the looper when dom loads
  const loaded = setInterval(() => {
    if (document.readyState === "complete") {
      clearInterval(loaded);

      loopId = looper();
    }
  }, 200);

  // listener for tab change => restart looper if tab state becomes active
  document.addEventListener("visibilitychange", () => {
    clearInterval(loopId);
    if (!document.hidden) loopId = looper();
  });

  // hide all pip buttons if dom is in full screen state
  document.addEventListener("fullscreenchange", togglePipButtons, false);
}

if (!window.alreadyInjected) {
  window.alreadyInjected = true;
  mainScript();
}
