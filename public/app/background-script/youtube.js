var ids = [
  "masthead-container",
  "secondary",
  "meta",
  "info-contents",
  "comments",
  "items",
  "head",
  "companion",
  "meta-contents"
];

var hide = ids => {
  ids.forEach(id => {
    var ele = document.getElementById(id);
    if (ele) ele.style.display = "none";
  });
};

var inject = () => {
  hide(ids);
  var ytVideo = document.getElementById("primary-inner");
  if (ytVideo) {
    ytVideo.style.position = "fixed";
    ytVideo.style.top = "0";
    ytVideo.style.left = "0";
  }
};

if (document.readyState === "complete") inject();

window.onload = inject;

var gg = video => {
  var root = document.body;
  console.log(video);
  if (video) {
    function rem(ele) {
      const c = ele.childNodes;
      let ret = false;
      for (let i = 0; i < c.length; i++)
        if (c[i] === video) ret = true;
        else if (rem(c[i])) ret = true;
      if (!ret && ele && ele.style) ele.style.display = "none";
      return ret;
    }
    rem(root);
  }
};

var pc = [];
var ptc = [];
var x = ele => {
  if (ele.id === "player-container") pc.push(ele);
  else if (ele.id === "player-theater-container") ptc.push(ele);
  const c = ele.childNodes;
  for (let i = 0; i < c.length; i++) x(c[i]);
};
x(document.body);

if (ptc.length > 0) {
  // is in theater mode
  for (let i = 0; i < ptc.length; i++)
    if (ptc[i].getElementsByTagName("video").length > 0) {
      gg(ptc[i]);
      break;
    }
} else if (pc.length > 0) {
  // is in default view
  console.log("DefaultView");
  for (let i = 0; i < pc.length; i++)
    if (pc[i].getElementsByTagName("video").length > 0) {
      gg(pc[i]);
      break;
    }
}
