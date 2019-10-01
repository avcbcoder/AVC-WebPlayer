# Mini Window - Spotify, youtube,..
[![Build Status](https://travis-ci.com/cam-barts/ObeyTheTestingGoat.svg?branch=master)](https://travis-ci.com/cam-barts/ObeyTheTestingGoat)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Twitter URL](https://img.shields.io/twitter/url/https/twitter.com/fold_left.svg?style=social&label=Follow%20%40avcbcoder)](https://twitter.com/avankyankit)
[![GitHub followers](https://img.shields.io/github/followers/avcbcoder.svg?style=social&label=Follow&maxAge=2592000)](https://github.com/avcbcoder?tab=followers)

Mini is a Chrome Extension which lets you control your spotify music from any browser tab.
Mini can create a mini window which always stays on top, so that you can watch videos while working also.

#### Build with  ![](https://img.shields.io/badge/-React-blue) ![](https://img.shields.io/badge/-StyledComponents-yellow) ![](https://img.shields.io/badge/-Javascript-red) ![](https://img.shields.io/badge/-HtmlCanvas-9cf) ![](https://img.shields.io/badge/-MeadiaStreaming-ff69b4) ![](https://img.shields.io/badge/-JQuery-green)

#### Stable release version : ![](https://img.shields.io/badge/version-1.1.3-blue)

----

### User Guide

#### For Spotify streaming :
- [x] Control your music from any tab.
- [x] Get `Lyrics` of the currently streaming song.
- [x] Get `Youtube Video` of the current song.
- [x] You can directly create a `mini window` of the song/video from the app itself. (view demo video for details)

#### Mini Window button :
> * A script is injected in every tab (new/refreshed) to add mini window buttons.   
> * The injected script attaches mini window button to every loaded video available on the page.  
> * Using this button you can start/stop mini window view for videos.

---

### Installing

1. Clone this repo (git required)
```
git clone https://github.com/avcbcoder/Mini---spotify-youtube
```
2. Install dependencies (npm/yarn required)
```
npm install 
or
yarn
```
3. Make build for chrome
```
npm build 
or 
yarn build
```

### Deployment
* Toggle Developer mode
```
Got to chrome://extensions/ and enable developer mode
```
* Add extension
```
Add extension and select build folder of the project
```

