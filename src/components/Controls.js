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
  Typography,
} from "@mui/material";
import {
  Pause,
  PlayArrow,
  Replay10,
  Forward10,
  VolumeUpOutlined as VolumeUp,
  VolumeDownOutlined as VolumeDown,
  VolumeMuteOutlined as VolumeMute,
  VolumeOffOutlined as VolumeOff,
  Fullscreen,
  FullscreenExit,
  Hd,
  SettingsOutlined as Settings,
  FilterNone
} from "@mui/icons-material";

//#901235

const Controls = (props) => {
  const [started, setStarted] = useState(false);
  //const [ playing, setPlaying ] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [time, setTime] = useState(0);
  const [volume, setVolume] = useState(100);
  const [oldVolume, setOldVolume] = useState(100);
  const [mute, setMute] = useState(false);
  const [changeQuality, setChangeQuality] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [resolutions, setResolutions] = useState([]);
  const [resolution, setResolution] = useState();
  const [duration, setDuration] = useState("0:00");
  const [convertedTime, setConvertedTime] = useState("0:00");
  const { playerRef, playing, handlePlay } = props;

  const convertTime = (duration) => {
    let hrs = Math.floor(duration / 3600);
    let mins = Math.floor((duration % 3600) / 60);
    let secs = Math.floor(duration % 60);

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  };

  const getSeconds = () => {
    const player = playerRef.current;

    let currentTime = (player.currentTime() / player.duration()) * 100;

    setTime(currentTime);
    setConvertedTime(convertTime(player.currentTime()));
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

      setResolutions(resolutionsTemp);
      setResolution(
        player.qualityLevels().levels_[player.qualityLevels().selectedIndex_]
          .width
      );
      setDuration(convertTime(player.duration()));
      setRefresh(!refresh);

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

      window.screen.orientation.lock("landscape").catch((err) => {
        console.log("Landscape not supported");
      });;
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
    //setConvertedTime(convertedTime(timeSeeked));
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

  const handleQualityChange = (selectedQuality) => {
    setResolution(selectedQuality);

    const player = playerRef.current;

    player.qualityLevels().levels_.map((value, index) => {
      if (value.width == selectedQuality) {
        player.qualityLevels().selectedIndex_ = index;
        player.qualityLevels()[index].enabled = true;
        player
          .qualityLevels()
          .trigger({ type: "change", selectedIndex: index });
        console.log(player.qualityLevels().selectedIndex_);
      } else {
        player.qualityLevels()[index].enabled = false;
      }
    });
  };

  const handleQualityToggle = () => {
    setChangeQuality(!changeQuality);
    console.log(document.body.children.root.children.vjs_video_3);
  };

  const handleReplay = () => {
    const player = playerRef.current;

    player.currentTime(player.currentTime() - 10);
    setConvertedTime(convertTime(player.currentTime() - 10));
  };

  const handleForward = () => {
    const player = playerRef.current;

    player.currentTime(player.currentTime() + 10);
    setConvertedTime(convertTime(player.currentTime() + 10));
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

          <IconButton onClick={handleReplay}>
            <Replay10 />
          </IconButton>

          <IconButton onClick={handleForward}>
            <Forward10 />
          </IconButton>
        </Grid>
        <Grid item xs={9}>
          <Grid container>
            <Grid item xs={11}>
              <Slider
                min={0}
                max={100}
                value={time}
                onChange={handleSeek}
                sx={{
                  color: "#901235",
                  height: 4,
                  "& .MuiSlider-thumb": {
                    width: 8,
                    height: 8,
                    transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                    "&:before": {
                      boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                    },
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: `0px 0px 0px 8px ${"rgb(255 255 255 / 16%)"}`,
                    },
                    "&.Mui-active": {
                      width: 20,
                      height: 20,
                    },
                  },
                  "& .MuiSlider-rail": {
                    opacity: 0.28,
                  },
                }}
              />
            </Grid>
            <Grid item sx={{ marginTop: 0.5, marginLeft: 2 }}>
              <Typography variant="caption" align="center">
                {convertedTime} / {duration}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Tooltip
            PopperProps={{
              container: document.body.children.root.children.vjs_video_3,
            }}
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: "transparent",
                },
              },
            }}
            title={
              <List
                sx={{
                  //width: 30,
                  //height: 100,
                  padding: 2,
                  background: "rgba(0,0,0,0.6)",
                  borderRadius: 1,
                }}
              >
                {resolutions?.map((value, index) => (
                  <ListItem
                    disablePadding
                    sx={
                      resolution == value ? { backgroundColor: "#901235" } : {}
                    }
                  >
                    <ListItemButton onClick={() => handleQualityChange(value)}>
                      {value + "p"}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            }
            open={changeQuality}
            disableFocusListener
            disableHoverListener
            disableTouchListener
          >
            <IconButton onClick={handleQualityToggle}>
              <FilterNone sx={{ transform: "rotate(-180deg)" }} />
            </IconButton>
          </Tooltip>
          <Tooltip
            PopperProps={{
              container: document.body.children.root.children.vjs_video_3,
            }}
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: "transparent",
                },
              },
            }}
            title={
              <Box
                sx={{
                  //width: 30,
                  height: 100,
                  padding: 2,
                  background: "rgba(0,0,0,0.6)",
                  borderRadius: 1,
                }}
              >
                <Slider
                  orientation="vertical"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={handleChangeVolume}
                  sx={{
                    color: "#901235",
                    "& .MuiSlider-thumb": {
                      width: 8,
                      height: 8,
                      transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                      "&:before": {
                        boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                      },
                      "&:hover, &.Mui-focusVisible": {
                        boxShadow: `0px 0px 0px 8px ${"rgb(255 255 255 / 16%)"}`,
                      },
                      "&.Mui-active": {
                        width: 20,
                        height: 20,
                      },
                    },
                    "& .MuiSlider-rail": {
                      opacity: 0.28,
                    },
                  }}
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
          <IconButton onClick={handleFullscreen}>
            <Settings />
          </IconButton>
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
