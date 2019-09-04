var playerControls = document.getElementsByClassName("player-controls");
var mediaButtons = playerControls ? playerControls[0].childNodes[0] : "";
var shuffle = mediaButtons ? mediaButtons.childNodes[0] : "";
var previous = mediaButtons ? mediaButtons.childNodes[1] : "";
var play = mediaButtons ? mediaButtons.childNodes[2] : "";
var next = mediaButtons ? mediaButtons.childNodes[3] : "";
var repeat = mediaButtons ? mediaButtons.childNodes[4] : "";
