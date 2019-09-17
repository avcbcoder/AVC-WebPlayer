// skip button
// document.getElementsByClassName('ytp-ad-skip-button-container')[0].click()

// hide ads
// document.getElementsByClassName('ytp-ad-overlay-container')[0].style.display="none"

// if (document.readyState === "complete") inject();

// window.onload = inject;

var constants = {
  PLAYER_THEATER: "player-theater",
  PLAYER_DEFAULT: "player-default",
  PLAYER_NOT_FOUND: "player-not-found"
};

function showHiddenNodes(nodes) {
  if (nodes && nodes.length > 0)
    nodes.forEach(node => {
      if (node && node.style) node.style.display = "block";
    });
}

function hideNodesExcept(video) {
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
        ele.style.display = "none";
        nodes.push(ele);
      }
      return ret;
    }
    remEleRecursively(root);
  }
  return nodes;
}

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
  const pc = [];
  const ptc = [];
  function findPlayer(ele) {
    if (ele.id === "player-container") pc.push(ele);
    else if (ele.id === "player-theater-container") ptc.push(ele);
    const c = ele.childNodes;
    for (let i = 0; i < c.length; i++) findPlayer(c[i]);
  }
  findPlayer(document.body);
  console.log(pc, ptc);

  if (pc.length === 0 && ptc.length === 0) return false;

  let player = null;

  if (ptc.length > 0) {
    for (let i = 0; i < ptc.length; i++)
      if (ptc[i].getElementsByTagName("video").length > 0) player = ptc[i];
    // if (ptc[i].getElementsByTagName("video").length > 0)
    //   player = ptc[i].getElementsByTagName("video")[0];
  }

  if (pc.length > 0) {
    for (let i = 0; i < pc.length; i++)
      if (pc[i].getElementsByTagName("video").length > 0) player = pc[i];
    // if (pc[i].getElementsByTagName("video").length > 0)
    //   player = pc[i].getElementsByTagName("video")[0];
  }
  console.log(player);
  if (player) {
    hideNodesExcept(player);
    // player.style.position = "fixed";
    // player.style.top = "0";
    // player.style.left = "0";
  }

  // var g = document.getElementsByTagName("ytd-player")[0].parentElement;
  // g = g.parentElement;
  // // g = g.parentElement;
  // // g = g.parentElement;
  // hideNodesExcept(g);
  // g.style.position = "fixed";
  // g.style.top = "0";
  // g.style.left = "0";
  // var positionInfo = g.getBoundingClientRect();
  // return true;
}

looper = () => {
  const id = setInterval(() => {
    try {
      if (script()) clearInterval(id);
    } catch (err) {}
  }, 1000);
};

window.onload = looper;

window.addEventListener("resize", () => {
  window.resizeTo(
    16 * 26.5 + (window.outerWidth - window.innerWidth),
    9 * 26.5 + (window.outerHeight - window.innerHeight)
  );
  document.body.style.overflow = "none";
});

/* For theater mode
var g = document.getElementsByTagName("ytd-player")
g = g[0];
g = g.parentElement;
g = g.parentElement;
hideNodesExcept(g);
g.style.position = "fixed";
g.style.top = "0";
g.style.left = "0";
*/

document.addEventListener(
  "fullscreenchange",
  () => {
    const fullscreenElement =
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement;
    if (fullscreenElement) {
      console.log("gg56");
    } else {
      console.log("hevdfvdfvdfve");
    }
  },
  false
);

document.getElementsByClassName('ytp-fullscreen-button ytp-button')[0].addEventListener
