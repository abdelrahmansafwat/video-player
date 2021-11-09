import React, { useState } from "react";
import { Fade } from "@mui/material";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-quality-levels";
import "videojs-landscape-fullscreen";
import Controls from "./Controls";

export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const { onReady } = props;
  const [ playing, setPlaying ] = useState(true);
  const [ hovered, setHovered ] = useState(false);

  const [options, setOptions] = useState({
    // lookup the options in the docs for more options
    autoplay: true,
    mute: true,
    controls: false,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8",
        type: "application/x-mpegURL",
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
        console.log(navigator.userAgent);

        player.landscapeFullscreen({
          fullscreen: {
            enterOnRotate: true,
            exitOnRotate: false,
            alwaysInLandscapeMode: true,
            iOS: true
          }
        })
        
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

    console.log(player.qualityLevels());
  }

  const handleHoverEnter = () => {
    setHovered(true);
  }

  const handleHoverLeave = () => {
    setHovered(false);
  }

  return (
    <>
      <div id={"videojsContainer"} data-vjs-player ref={containerRef} onMouseOver={handleHoverEnter} onMouseLeave={handleHoverLeave} onClick={handleHoverEnter}>
        <video ref={videoRef} className="video-js vjs-big-play-centered" onClick={handlePlay} />
        <Controls playerRef={playerRef} playing={playing} handlePlay={handlePlay} />
      </div>
    </>
  );
};

export default VideoJS;
