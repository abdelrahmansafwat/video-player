import React, { useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export const VideoJS = ( props ) => {

  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const { onReady } = props;

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


  React.useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const player = playerRef.current = videojs(videoElement, options, () => {
        console.log("player is ready");
        onReady && onReady(player);
      });
    } else {
      // you can update player here [update player through props]
      const player = playerRef.current;
      // player.autoplay(options.autoplay);
      // player.src(options.sources);
      player.controls(options.controls);
    }
  }, [options]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
      <>
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
    <button onClick={() => {
        const player = playerRef.current;
        // player.autoplay(options.autoplay);
        // player.src(options.sources);
        player.requestFullscreen();       
      }}>Hide controls</button>
  </>
  );
}

export default VideoJS;