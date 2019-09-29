// spotify changed the structure of dom in controls (@ 27-09-2019)
// added wrappers around every control button
var playerControls = document.getElementsByClassName("player-controls");
var mediaButtons = playerControls ? playerControls[0].childNodes[0] : "";

var shuffleWrapper = mediaButtons ? mediaButtons.childNodes[0] : "";
var shuffle = shuffleWrapper ? shuffleWrapper.childNodes[0] : "";

var previousWrapper = mediaButtons ? mediaButtons.childNodes[1] : "";
var previous = previousWrapper ? previousWrapper.childNodes[0] : "";

var playWrapper = mediaButtons ? mediaButtons.childNodes[2] : "";
var play = playWrapper ? playWrapper.childNodes[0] : "";

var nextWrapper = mediaButtons ? mediaButtons.childNodes[3] : "";
var next = nextWrapper ? nextWrapper.childNodes[0] : "";

var repeatWrapper = mediaButtons ? mediaButtons.childNodes[4] : "";
var repeat = repeatWrapper ? repeatWrapper.childNodes[0] : "";
