/*global chrome*/
/* src/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import "./content.css";
import WindowButton from "./components/youtube/window-button"
import { SUPPORTED_SITES, ID } from './constants'
import { identifySite } from './utils/functions'

class Main extends React.Component {
  render() {
    return (
      <Frame head={[<link type="text/css" rel="stylesheet" href={chrome.runtime.getURL("/static/css/content.css")} ></link>]}>
        <FrameContextConsumer>
          {
            // Callback is invoked with iframe's window and document instances
            ({ document, window }) => {
              // Render Children
              return (
                <div className={'my-extension'}>
                  <h1>Hello world</h1>
                </div>
              )
            }
          }
        </FrameContextConsumer>
      </Frame>
    )
  }
}

// since we have access of document (dom) in this file, we can inject any react component now

function performMagic() {
  document.getElementsByTagName('video')[0].requestPictureInPicture();
}

if (identifySite(document.location.href) === SUPPORTED_SITES.YOUTUBE) {
  console.log('youtube working')

  window.onload = function () {
    console.log('loaded')
    const myDoc = this.document
    const collectionButtons = myDoc.getElementById('top-level-buttons');
    const app = myDoc.createElement('div');
    app.id = "432";
    collectionButtons.insertBefore(app, collectionButtons.childNodes[0])
    console.log(collectionButtons.childNodes[0])
    ReactDOM.render(
      <WindowButton
        document={myDoc}
        width={collectionButtons.childNodes[0].offsetWidth}
        height={collectionButtons.childNodes[0].offsetHeight}
        magic={performMagic}
      />,
      app
    );
  }
}

const app = document.createElement('div');
app.id = "my-extension-root";

document.body.appendChild(app);
ReactDOM.render(<Main />, app);

app.style.display = "none";

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "clicked_browser_action") {
      toggle();
    }
  }
);

function toggle() {
  if (app.style.display === "none") {
    app.style.display = "block";
  } else {
    app.style.display = "none";
  }
}

