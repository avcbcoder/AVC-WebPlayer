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
    if (videos && videos.length > 0)
      [].forEach.call(videos, video => {
        let pipId = video.dataset.pipId;
        if (pipId in pipObj) return;
        const posInfo = video.getBoundingClientRect();
        if (video.src && posInfo.width > 200 && posInfo.height > 200) {
          const pip = addPipButtonForVideo(video);
          updatePos(video, pip);
          pipObj[pipUniqueIdHash] = { video, pip };
          video.dataset.pipId = pipUniqueIdHash;
          window.addEventListener("scroll", () => {
            updatePos(video, pip);
          });
          new ResizeObserver(() => {
            updatePos(video, pip);
          }).observe(video);
          pipUniqueIdHash++;
        }
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

  document.addEventListener("fullscreenchange", togglePipButtons, false);

  const looper = () => {
    const intervalId = setInterval(() => {
      // filter on already added pips
      console.log("interval=> ", pipObj, new Date().getTime());
      for (let pipId in pipObj) {
        const { pip, video } = pipObj[pipId];
        if (!video && pip && pip.parentElement) {
          pip.parentElement.removeChild(pip);
          delete pipObj[pipId];
        } else {
          const posInfo = video.getBoundingClientRect();
          if (posInfo.width > 200 && posInfo.height > 200 && video.src) {
            updatePos(video, pip);
          } else {
            if (pip && pip.parentElement) pip.parentElement.removeChild(pip);
            delete pipObj[pipId];
          }
        }
      }

      // find and filter videos
      let videos = document.getElementsByTagName("video");
      videos = [].filter.call(videos, video => {
        const posInfo = video.getBoundingClientRect();
        return posInfo.width > 200 && posInfo.height > 200 && video.src;
      });

      if (videos.length > 0 && !document.pictureInPictureElement) {
        addPipFor(videos);
      }
    }, 1000);
    return intervalId;
  };

  window.onload = () => {
    console.log("window loadded");
    loopId = looper();
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(loopId);
    } else {
      console.log("focus");
      clearInterval(loopId);
      loopId = looper();
    }
  });
}

mainScript();
