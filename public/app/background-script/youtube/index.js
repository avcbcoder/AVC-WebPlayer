var storage = window.sessionStorage;
var constants = {
  PLAYER_THEATER: "player-theater",
  PLAYER_DEFAULT: "player-default",
  PLAYER_NOT_FOUND: "player-not-found"
};

var tgNodes = [];

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
  console.log("nonParentDomNodes()", video);
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
  console.log("script()");
  const { type, player } = identifyPlayer();
  console.log("script()", { type, player });
  let video = null;
  if (type === constants.PLAYER_THEATER) {
    var g = document.getElementsByTagName("ytd-player")[0].parentElement;
    g = g ? g.parentElement : "";
    g = g ? g.parentElement : "";
    g = g ? g.parentElement : "";
    video = g;
  } else if (type === constants.PLAYER_DEFAULT) {
    video = player;
  }

  if (video) {
    nonParentDomNodes(video);
    toggleNodes();
    video.style.position = "fixed";
    video.style.top = "0";
    video.style.left = "0";
    const width = 427 + (window.outerWidth - window.innerWidth);
    const height = 240 + (window.outerHeight - window.innerHeight);
    console.log({ width, height });
    window.resizeTo(width, height);
    document.body.style.overflow = "none";
    storage.setItem("playerDimension", {
      width: video.offsetWidth,
      height: video.offsetHeight
    });
    return true;
  }
  return false;
}

looper = () => {
  const id = setInterval(() => {
    try {
      if (script()) clearInterval(id);
    } catch (err) {}
  }, 5000);
};

window.onload = looper;

window.addEventListener("resize", () => {
  const width = 427 + (window.outerWidth - window.innerWidth);
  const height = 240 + (window.outerHeight - window.innerHeight);
  window.resizeTo(width, height);
  //   const playerDimension = storage.getItem("playerDimension");
  //   if (!playerDimension) return;
  //   window.resizeTo(
  //     playerDimension.width + (window.outerWidth - window.innerWidth),
  //     playerDimension.height + (window.outerHeight - window.innerHeight)
  //   );
  document.body.style.overflow = "none";
});

document.addEventListener("fullscreenchange", toggleNodes, false);
