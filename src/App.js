import React, { useState } from "react";
import VideoJS from './components/VideoJS' // point to where the functional component is stored

const App = () => {
  const playerRef = React.useRef(null);
  const [options, setOptions] = useState({ // lookup the options in the docs for more options
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: 'https://s3.amazonaws.com/_bc_dml/example-content/sintel_dash/sintel_vod.mpd',
      type: 'application/dash+xml'
    }]
  });
  const [refresh, setRefresh] = useState(false);

  const videoJsOptions = { // lookup the options in the docs for more options
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: 'https://s3.amazonaws.com/_bc_dml/example-content/sintel_dash/sintel_vod.mpd',
      type: 'application/dash+xml'
    }]
  }

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // you can handle player events here
    player.on('waiting', () => {
      console.log('player is waiting');
    });

    player.on('dispose', () => {
      console.log('player will dispose');
    });
  };

  return (
    <>
      <div>Rest of app here</div>

      <VideoJS options={options} onReady={handlePlayerReady} />

    </>
  );
}

export default App;