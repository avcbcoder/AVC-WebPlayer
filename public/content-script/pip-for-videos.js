function pipforvids() {
  const pipAddedNodes = [];

  const script = videos => {
    if (videos && videos.length > 0)
      [].forEach.call(videos, video => {
        if (video.dataset.pipAdded === "done") return;
        const posInfo = video.getBoundingClientRect();
        if (posInfo.width > 200 && posInfo.height > 200) {
          console.log("ading for", video, posInfo);
          const pip = addPipButtonForVideo(video);
          updatePos(video, pip);
          pipAddedNodes.push({ video, pip });
          video.dataset.pipAdded = "done";
        }
      });
  };

  const updatePos = (video, pip) => {
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
    const fullScreen =
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement;
    if (pipAddedNodes)
      [].forEach.call(pipAddedNodes, ({ video, pip }) => {
        if (pip && pip.style) pip.style.display = fullScreen ? "none" : "flex";
      });
    return;
  };

  document.addEventListener("fullscreenchange", togglePipButtons, false);

  const alreadyPip = () => {
    const myPip = document.getElementById("pip-btn-id");
    if (myPip) {
      // if opened tab consist our own pip button
      [].forEach.call(pipAddedNodes, ({ video, pip }) => {
        if (pip && pip.parentElement && pip.parentElement.removeChild)
          pip.parentElement.removeChild(pip);
      });
      return true;
    }
    return false;
  };

  const onLoad = setInterval(() => {
    if (alreadyPip()) clearInterval(onLoad);
    // find and filter videos
    let videos = document.getElementsByTagName("video");
    videos = [].filter.call(videos, video => {
      const posInfo = video.getBoundingClientRect();
      return posInfo.width > 200 && posInfo.height > 200 && video.src;
    });
    if (pipAddedNodes)
      for (let i = 0; i < pipAddedNodes.length; i++) {
        const video = pipAddedNodes[i].video;
        if (!video) {
          const p = pipAddedNodes[i].pip;
          p.parentElement.removeChild(p);
        }
        const posInfo = video.getBoundingClientRect();
        if (!(posInfo.width > 200 && posInfo.height > 200 && video.src)) {
          const p = pipAddedNodes[i].pip;
          if (p && p.parentElement) p.parentElement.removeChild(p);
        }
      }
    if (videos.length > 0 && !document.pictureInPictureElement) {
      script(videos);
      // videos exist in page
      [].forEach.call(pipAddedNodes, ({ video, pip }) => {
        updatePos(video, pip);
      });
    }
  }, 1000);

  window.onload = setTimeout(onLoad, 5000);
}

pipforvids();
