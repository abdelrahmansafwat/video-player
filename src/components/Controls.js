import { useState, useEffect } from "react";
import {
  Slider,
  Box,
  IconButton,
  Grid,
  Button,
  Popover,
  Collapse,
  Tooltip,
  List,
  ListItem,
  ListItemButton,
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
  Hd,
} from "@mui/icons-material";

const Controls = (props) => {
  const [started, setStarted] = useState(false);
  //const [ playing, setPlaying ] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [time, setTime] = useState(0);
  const [volume, setVolume] = useState(0);
  const [oldVolume, setOldVolume] = useState(0);
  const [mute, setMute] = useState(false);
  const [changeQuality, setChangeQuality] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [resolutions, setResolutions] = useState([]);
  const { playerRef, playing, handlePlay } = props;

  const getSeconds = () => {
    const player = playerRef.current;

    let currentTime = (player.currentTime() / player.duration()) * 100;

    setTime(currentTime);
  };

  const autoPlay = () => {
    const player = playerRef.current;

    if (player && player.readyState() > 0) {
      console.log(player.readyState());
      console.log(player.qualityLevels());

      let resolutionsTemp = [...resolutions];

      player.qualityLevels().levels_.map((value) => {
        resolutionsTemp.push(value.width);
      });

      resolutionsTemp.reverse();

      setResolutions(resolutions);

      //player.volume(100);
      setStarted(true);
    }
  };

  if (!started) {
    autoPlay();
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getSeconds();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFullscreen = () => {
    const player = playerRef.current;

    if (fullscreen) {
      player.exitFullscreen();
    } else {
      player.requestFullscreen();
    }
    setFullscreen(!fullscreen);
  };

  /*
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
  */

  /*
  useEffect(() => {
    setInterval(() => {
      handlePlay();
    }, 3000);
  }, []);
  */

  const handleSeek = (event, newValue) => {
    const player = playerRef.current;

    let timeSeeked = parseInt(player.duration() * (newValue / 100));

    //(player.currentTime()/player.duration()) * 100;

    setTime(newValue);

    player.currentTime(timeSeeked);
  };

  const handleMute = () => {
    const player = playerRef.current;

    if (mute) {
      if (oldVolume === 0) {
        player.volume(100);
        setVolume(100);
      } else {
        player.volume(oldVolume / 100);
        setVolume(oldVolume);
      }
    } else {
      player.volume(0);
      setOldVolume(volume);
      setVolume(0);
    }

    setMute(!mute);
  };

  const handleChangeVolume = (event, newValue) => {
    const player = playerRef.current;

    player.volume(newValue / 100);

    setVolume(newValue);
    setMute(false);
  };

  const handleQualityChange = (selectedQuality) => {};

  const handleQualityToggle = () => {
    setChangeQuality(!changeQuality);
    console.log(document.body.children.root.children.vjs_video_3);
  };

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
          <Tooltip
            PopperProps={{
              container: document.body.children.root.children.vjs_video_3,
            }}
            title={
              <Box
                sx={{
                  //width: 30,
                  height: 100,
                  padding: 1,
                  background: "rgba(0,0,0,0)",
                }}
              >
                <Slider
                  orientation="vertical"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={handleChangeVolume}
                />
              </Box>
            }
          >
            <IconButton onClick={handleMute}>
              {(mute || volume === 0) && <VolumeOff />}
              {!mute && volume >= 66 && <VolumeUp />}
              {!mute && volume >= 33 && volume < 66 && <VolumeDown />}
              {!mute && volume < 33 && volume > 0 && <VolumeMute />}
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={9}>
          <Slider min={0} max={100} value={time} onChange={handleSeek} />
        </Grid>
        <Grid item>
          <Tooltip
            PopperProps={{
              container: document.body.children.root.children.vjs_video_3,
            }}
            title={
              <List>
                {resolutions.map((value, index) => {
                  return (
                    <ListItem
                      disablePadding
                      sx={{ backgroundColor: "rgba(120, 120, 120, 1)" }}
                    >
                      <ListItemButton>720p</ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            }
            open={changeQuality}
            disableFocusListener
            disableHoverListener
            disableTouchListener
          >
            <IconButton onClick={handleQualityToggle}>
              <Hd />
            </IconButton>
          </Tooltip>
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
