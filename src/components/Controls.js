import { useState } from 'react';
import {
  Slider,
  Box,
  IconButton,
  Grid,
  Button,
  Popover,
  Collapse,
} from "@mui/material";
import {
  Pause,
  PlayArrow,
  Replay10,
  Forward10,
  VolumeUp,
  VolumeDown,
  VolumeMute,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
} from "@mui/icons-material";

const Controls = (props) => {
  const [ playing, setPlaying ] = useState(false);
  const [ fullscreen, setFullscreen ] = useState(false);
  const [ time, setTime ] = useState(0);
  const [ volume, setVolume ] = useState(100);
  const [ oldVolume, setOldVolume ] = useState(100);
  const [ mute, setMute ] = useState(false);
  const { playerRef } = props;

  const handleFullscreen = () => {
    const player = playerRef.current;

    if(fullscreen){
      player.exitFullscreen();
    }
    else {
      player.requestFullscreen();
    }
    setFullscreen(!fullscreen);
  }

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

  const handleSeek = (event, newValue) => {
    const player = playerRef.current;

    let timeSeeked = parseInt(player.duration() * (newValue/100));

    //(player.currentTime()/player.duration()) * 100;

    setTime(newValue);

    player.currentTime(timeSeeked);
  }

  const handleMute = () => {
    const player = playerRef.current;

    if(mute){
      player.volume(oldVolume/100);
      setVolume(oldVolume);
    }
    else {
      player.volume(0);
      setOldVolume(volume);
      setVolume(0);
    }

    setMute(!mute);
  }

  const handleChangeVolume = (event, newValue) => {
    const player = playerRef.current;

    player.volume(newValue/100);

    setVolume(newValue);
  }

  return (
    <Box
      sx={{
        width: "100%",
        position: "absolute",
        bottom: 0,
        left: 0,
        background: "rgba(0,0,0,0.6)",
        //display: "flex",
        //flexDirection: "column",
        //justifyContent: "space-around",
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        //style={{ padding: 16 }}
        spacing={3}
      >
        <Grid item>
          <IconButton onClick={handlePlay}>
            {!playing && <PlayArrow />}
            {playing && <Pause />}
          </IconButton>
          <IconButton onClick={handleMute}>
            {(mute || volume === 0) && <VolumeOff />}
            {!mute && volume >= 66 && <VolumeUp />}
            {!mute && volume >= 33 && volume < 66 && <VolumeDown />}
            {!mute && volume < 33 && volume > 0 && <VolumeMute />}
          </IconButton>
          <Slider min={0} max={100} value={volume} onChange={handleChangeVolume} />
        </Grid>
        <Grid item xs={9}>
          <Slider min={0} max={100} value={time} onChange={handleSeek} />
        </Grid>
        <Grid item>
          <IconButton onClick={handleFullscreen}>
            {!fullscreen && <Fullscreen />}
            {fullscreen && <FullscreenExit />}
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Controls;
