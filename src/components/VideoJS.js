import React, { useState } from "react";
import { Slider } from "@mui/material";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Controls from "./Controls";

export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const { onReady } = props;
  const [ playing, setPlaying ] = useState(false);

  const [options, setOptions] = useState({
    // lookup the options in the docs for more options
    autoplay: true,
    mute: true,
    controls: false,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: "https://s3.amazonaws.com/_bc_dml/example-content/sintel_dash/sintel_vod.mpd",
        type: "application/dash+xml",
      },
    ],
  });

  React.useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const player = (playerRef.current = videojs(videoElement, options, () => {
        console.log("player is ready");
        onReady && onReady(player);
      }));
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

  const handlePlay = () => {
    const player = playerRef.current;

    if(playing){
      player.pause();
    }
    else {
      player.play();
    }
    setPlaying(!playing);
  }

  return (
    <>
      <div data-vjs-player ref={containerRef}>
        <video ref={videoRef} className="video-js vjs-big-play-centered" onClick={handlePlay} />
        <Controls playerRef={playerRef} playing={playing} handlePlay={handlePlay} />
      </div>
      <button
        onClick={() => {
          const player = playerRef.current;
          // player.autoplay(options.autoplay);
          // player.src(options.sources);
          player.controls(false);
        }}
      >
        Hide controls
      </button>
    </>
  );
};

export default VideoJS;
