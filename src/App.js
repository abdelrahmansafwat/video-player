import React, { useState } from "react";
import VideoJS from './components/VideoJS'

const App = () => {
  const playerRef = React.useRef(null);
  const [options, setOptions] = useState({
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: 'https://s3.amazonaws.com/_bc_dml/example-content/sintel_dash/sintel_vod.mpd',
      type: 'application/dash+xml'
    }]
  });

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
      <VideoJS options={options} onReady={handlePlayerReady} />
    </>
  );
}

export default App;