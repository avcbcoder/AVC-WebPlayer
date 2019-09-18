var addedNodes = [];

function script(videos) {
  if (addedNodes && addedNodes.length > 0)
    [].forEach.call(addedNodes, ({ video, pip }) => {
      if (pip && pip.parentElement && pip.parentElement.removeChild)
        pip.parentElement.removeChild(pip);
    });
  if (videos && videos.length > 0)
    [].forEach.call(videos, video => {
      const posInfo = video.getBoundingClientRect();
      if (posInfo.width > 200 && posInfo.height > 200) {
        const pip = addPipButton(video);
        updatePos(video, pip);
        addedNodes.push({ video, pip });
      }
    });
}

function updatePos(video, pip) {
  const posInfo = video.getBoundingClientRect();
  pip.style.left = `${Math.floor(posInfo.x < 0 ? 0 : posInfo.x + 8)}px`;
  pip.style.top = `${Math.floor(posInfo.y < 0 ? 0 : posInfo.y + 8)}px`;
}

function addPipButton(video) {
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
  video.div.addEventListener("mouseover", () => {
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

  video.addEventListener("leavepictureinpicture", () => {
    div.innerText = "Start Mini Mode";
  });

  return div;
}

function togglePipButtons() {
  const fullScreen =
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement;
  if (addedNodes)
    [].forEach.call(addedNodes, ({ video, pip }) => {
      if (pip && pip.style) pip.style.display = fullScreen ? "none" : "flex";
    });
  return;
}

document.addEventListener("fullscreenchange", togglePipButtons, false);

function alreadyPip() {
  const myPip = document.getElementById("pip-btn-id");
  if (myPip) {
    // if opened tab consist our own pip button
    [].forEach.call(addedNodes, ({ video, pip }) => {
      if (pip && pip.parentElement && pip.parentElement.removeChild)
        pip.parentElement.removeChild(pip);
    });
    return true;
  }
  return false;
}

const onLoad = setInterval(() => {
  console.log("Executing script");
  if (alreadyPip()) clearInterval(onLoad);
  const videos = document.getElementsByTagName("video");
  if (videos.length > 0 && !document.pictureInPictureElement) {
    script(videos);
    // videos exist in page
    [].forEach.call(addedNodes, ({ video, pip }) => {
      updatePos(video, pip);
    });
  }
}, 1000);

window.onload = onLoad;
