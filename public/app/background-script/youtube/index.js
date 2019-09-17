var storage = window.sessionStorage;
var constants = {
  PLAYER_THEATER: "player-theater",
  PLAYER_DEFAULT: "player-default",
  PLAYER_NOT_FOUND: "player-not-found",
  PIP_BTN_ID: "pip-btn-id"
};

var tgNodes = [];

function addPipButton() {
  let div = document.getElementById(constants.PIP_BTN_ID);
  if (div) return;
  div = document.createElement("div");
  div.id = constants.PIP_BTN_ID;
  document.body.appendChild(div);
  const style = div.style;
  style.width = "150px";
  style.height = "25px";
  style.position = "fixed";
  style.top = "10px";
  style.right = "10px";
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
  style.style.borderRadius = "5px";
  style.opacity = "0.6";
  div.innerHTML = "Start mini mode";

  div.addEventListener("mouseover", () => {
    console.log("JOINED");
    const btn = document.getElementById(constants.PIP_BTN_ID);
    btn.style.boxShadow = "5px 5px 5px #c1c8d4";
    btn.style.opacity = "1";
  });

  div.addEventListener("onmouseleave", () => {
    console.log("LEFT");
    const btn = document.getElementById(constants.PIP_BTN_ID);
    btn.style.boxShadow = "";
    btn.style.opacity = "0.6";
  });
}

// set display to block if in fullscreen mode else hides it
function toggleNodes() {
  //   const nodes = storage.getItem("domNodes");
  const nodes = tgNodes;
  const fullscreenElement =
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement;
  if (nodes && nodes.length > 0) {
    console.log("toggle()", { fullscreenElement }, nodes.length);
    nodes.forEach(node => {
      node.style.display = fullscreenElement ? "block" : "none";
    });
  }
}

// returns all the nodes which are not parent of this element
function nonParentDomNodes(video) {
  var root = document.body;
  const nodes = [];
  console.log(video);
  if (video) {
    function remEleRecursively(ele) {
      const c = ele.childNodes;
      let ret = false;
      for (let i = 0; i < c.length; i++)
        if (c[i] === video) ret = true;
        else if (remEleRecursively(c[i])) ret = true;
      if (!ret && ele && ele.style) {
        nodes.push(ele);
        ele.style.display = "none";
      }
      return ret;
    }
    remEleRecursively(root);
  }
  console.log("nonParentDomNodes()", "noes set", nodes.length);
  tgNodes = nodes;
  storage.setItem("domNodes", nodes);
}

// returns whether the youtube player is in theater or default mode
function identifyPlayer() {
  const pc = [];
  const ptc = [];
  function findPlayer(ele) {
    if (ele.id === "player-container") pc.push(ele);
    else if (ele.id === "player-theater-container") ptc.push(ele);
    const c = ele.childNodes;
    for (let i = 0; i < c.length; i++) findPlayer(c[i]);
  }
  findPlayer(document.body);

  if (pc.length === 0 && ptc.length === 0)
    return { type: constants.PLAYER_NOT_FOUND, player: null };

  if (ptc.length > 0) {
    for (let i = 0; i < ptc.length; i++)
      if (ptc[i].getElementsByTagName("video").length > 0)
        return { type: constants.PLAYER_THEATER, player: ptc[i] };
  }

  if (pc.length > 0) {
    for (let i = 0; i < pc.length; i++)
      if (pc[i].getElementsByTagName("video").length > 0)
        return { type: constants.PLAYER_DEFAULT, player: pc[i] };
  }
}

function script() {
  const { type, player } = identifyPlayer();
  if (type === constants.PLAYER_THEATER) {
    let video = document.getElementsByTagName("ytd-player")[0];
    video = video ? video.parentElement : "";
    video = video ? video.parentElement : "";
    if (video) {
      nonParentDomNodes(video);
      toggleNodes();
      document.body.style.overflow = "hidden";
      addPipButton();
    }
    return true;
  } else if (type === constants.PLAYER_DEFAULT) {
    nonParentDomNodes(player);
    toggleNodes();
    addPipButton();
    return true;
  }
  return false;
}

looper = () => {
  const idOfScript = setInterval(() => {
    console.log("---", new Date().getTime());
    try {
      if (script()) clearInterval(idOfScript);
    } catch (err) {}
  }, 500);
};

function addListeners() {
  document.addEventListener("fullscreenchange", toggleNodes, false);
  window.addEventListener("resize", () => {
    document.body.style.overflow = "none";
  });

  let buttonChecker = setInterval(() => {
    if (document.readyState === "complete") {
      const hideBtns = classId => {
        const btns = document.getElementsByClassName(classId);
        if (btns && btns.length > 0)
          [].forEach.call(btns, btn => {
            btn.style.display = "none";
          });
      };
      hideBtns("ytp-size-button");
      hideBtns("ytp-miniplayer-button");
      clearInterval(buttonChecker);
    }
  }, 1000);
}

window.onload = looper;
addListeners();
