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
  ListItemText,
  Drawer,
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
  FilterNone,
  ArrowForwardIos as ArrowForward,
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
  const [changeSpeed, setChangeSpeed] = useState(false);
  const [changeSubtitles, setChangeSubtitles] = useState(false);
  const [changeAudio, setChangeAudio] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [resolutions, setResolutions] = useState([]);
  const [resolution, setResolution] = useState();
  const [speed, setSpeed] = useState(1);
  const [subtitles, setSubtitles] = useState("None");
  const [subtitlesList, setSubtitlesList] = useState([]);
  const [audio, setAudio] = useState("English");
  const [audioList, setAudioList] = useState("English");
  const [settingsMenu, setSettingsMenu] = useState(false);
  const [duration, setDuration] = useState("0:00");
  const [convertedTime, setConvertedTime] = useState("0:00");
  const [video, setVideo] = useState(0);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [playlist, setPlaylist] = useState([
    {
      name: "Parkour",
      url: "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8",
      type: "application/x-mpegURL",
      image: "https://i.ibb.co/q7ZbgpG/firefox-Ld-Uv-Vmd-Nd2.png",
      subtitles: []
    },
    {
      name: "Big Buck Bunny",
      url: "https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8",
      type: "application/x-mpegURL",
      image: "https://i.ibb.co/VQMfYkw/firefox-YFgg5-BMBrj.png",
      subtitles: []
    },
    {
      name: "Sintel",
      url: "https://bitmovin-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
      type: "application/x-mpegURL",
      image: "https://i.ibb.co/JzmrGrY/firefox-r-ZUXf-Fa-SAp.png",
      subtitles: [
        {
          kind: "subtitles",
          src: "http://iandevlin.github.io/mdn/video-player-with-captions/subtitles/vtt/sintel-en.vtt",
          srclang: "en",
          label: "English",
        },
        {
          kind: "subtitles",
          src: "http://iandevlin.github.io/mdn/video-player-with-captions/subtitles/vtt/sintel-de.vtt",
          srclang: "de",
          label: "German",
        },
        {
          kind: "subtitles",
          src: "http://iandevlin.github.io/mdn/video-player-with-captions/subtitles/vtt/sintel-es.vtt",
          srclang: "es",
          label: "Spanish",
        },
      ],
    },
    {
      name: "Skate Phantom Flex",
      url: "http://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8",
      type: "application/x-mpegURL",
      image: "https://i.ibb.co/jhVwMHR/firefox-4-Gap-Y3yl2b.png",
    },
  ]);
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
    setDuration(convertTime(player.duration()));
  };

  const autoPlay = () => {
    const player = playerRef.current;

    if (player && player.readyState() > 0) {
      console.log(player.readyState());
      console.log(player.qualityLevels());

      getResolutions();
      getSubtitles();

      /*
        window.screen.orientation.lock("landscape").catch((err) => {
          console.log("Landscape not supported");
        });
        */

      //player.landscapeFullscreen();

      setDuration(convertTime(player.duration()));
      setRefresh(!refresh);

      //player.volume(100);
      setStarted(true);
    }
  };

  const getResolutions = () => {
    const player = playerRef.current;

    let resolutionsTemp = [];

    player.qualityLevels().levels_.map((value) => {
      resolutionsTemp.push(value.width);
    });

    resolutionsTemp.reverse();

    setResolutions(resolutionsTemp);
    setResolution(
      player.qualityLevels().levels_[player.qualityLevels().selectedIndex_]
        .width
    );
  };

  const getSubtitles = () => {
    const player = playerRef.current;
    let currentSubtitles = ["None"];

    player.textTracks().tracks_.map((value, index) => {
      if(value.label != "segment-metadata"){
        currentSubtitles.push(value.label);
        console.log("value.label", value.label);
      }
    });

    setSubtitlesList(currentSubtitles);
  }

  const getAudio = () => {
    const player = playerRef.current;
    let currentAudio = [];

    player.audioTracks().tracks_.map((value, index) => {
      currentAudio.push(value.label);
      console.log("value.label", value.label);
    });

    setAudioList(currentAudio);
    setAudio(currentAudio[0]);
  }

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

      /*
        window.screen.orientation.lock("landscape").catch((err) => {
          console.log("Landscape not supported");
        });
        */
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

  const handleAudioChange = (selectedAudio) => {
    const player = playerRef.current;

    player.audioTracks().tracks_.map((value, index) => {
      if (value.label == selectedAudio) {
        player.audioTracks().tracks_[index].enabled = true;
      } else {
        player.audioTracks().tracks_[index].mode = false;
      }
    });

    setAudio(selectedAudio);
  };

  const handleSubtitlesChange = (selectedSubtitles) => {
    const player = playerRef.current;

    console.log(player.textTracks());

    player.textTracks().tracks_.map((value, index) => {
      if (value.label == selectedSubtitles) {
        player.textTracks().tracks_[index].mode = "showing";
      } else {
        player.textTracks().tracks_[index].mode = "disabled";
      }
    });

    setSubtitles(selectedSubtitles);
  };

  const handleSpeedChange = (selectedSpeed) => {
    const player = playerRef.current;

    player.playbackRate(selectedSpeed);
    setSpeed(selectedSpeed);
  };

  const handleToggleSpeed = () => {
    setChangeSpeed(true);
    setSettingsMenu(false);
  };

  const handleToggleAudio = () => {
    const player = playerRef.current;

    console.log("player.audioTracks()", player.audioTracks());
    getAudio();
    setChangeAudio(true);
    setSettingsMenu(false);
  };

  const handleToggleSubtitles = () => {
    getSubtitles();
    setChangeSubtitles(true);
    setSettingsMenu(false);
  };

  const handleToggleQuality = () => {
    getResolutions();
    setChangeQuality(true);
    setSettingsMenu(false);
  };

  const handleToggleSettingsMenu = () => {
    setSettingsMenu(!settingsMenu);
    setChangeAudio(false);
    setChangeSubtitles(false);
    setChangeSpeed(false);
    setChangeQuality(false);
  };

  const handlePlaylistToggle = () => {
    setPlaylistOpen(!playlistOpen);
    setSettingsMenu(false);
    setChangeAudio(false);
    setChangeSubtitles(false);
    setChangeSpeed(false);
    setChangeQuality(false);
  };

  const handleVideoChange = (selectedVideo) => {
    const player = playerRef.current;

    player.src({
      src: playlist[selectedVideo].url,
      type: playlist[selectedVideo].type,
    });
    setVideo(selectedVideo);
    handlePlaylistToggle();
    props.setPlaying(true);
  };

  return (
    <>
      <Drawer
        PaperProps={{
          sx: {
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "white",
            padding: 1,
          },
        }}
        anchor="right"
        open={playlistOpen}
        onClose={handlePlaylistToggle}
      >
        {playlist.map((value, index) => (
          <Box
            sx={{
              backgroundImage: `url(${value.image})`,
              width: 180,
              height: 150,
              borderRadius: 5,
              margin: 3,
            }}
          >
            <Button
              sx={
                video == index
                  ? {
                      backgroundColor: "rgba(144, 18, 53, 0.6)",
                      width: 180,
                      height: 150,
                      borderRadius: 5,
                      color: "white",
                    }
                  : {
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      width: 180,
                      height: 150,
                      borderRadius: 5,
                      color: "white",
                    }
              }
              onClick={() => handleVideoChange(index)}
            >
              {value.name}
            </Button>
          </Box>
        ))}
      </Drawer>
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
          //spacing={3}
        >
          <Grid item xs={2}>
            <IconButton onClick={handlePlay}>
              {!playing && <PlayArrow sx={{ fontSize: "1.75vw" }} />}
              {playing && <Pause sx={{ fontSize: "1.75vw" }} />}
            </IconButton>

            <IconButton onClick={handleReplay}>
              <Replay10 sx={{ fontSize: "1.75vw" }} />
            </IconButton>

            <IconButton onClick={handleForward}>
              <Forward10 sx={{ fontSize: "1.75vw" }} />
            </IconButton>
          </Grid>
          <Grid item xs={8}>
            <Grid container>
              <Grid item xs={10}>
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
              <Grid item sx={{ marginTop: 1, marginLeft: 2 }}>
                <Box sx={{ fontSize: "1vw" }}>
                  {convertedTime} / {duration}
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2} justifyContent="flex-end" alignContent="flex-end">
            <Grid container justifyContent="flex-end" alignContent="flex-end">
              <IconButton onClick={handlePlaylistToggle}>
                <FilterNone
                  sx={{ transform: "rotate(-180deg)", fontSize: "1.75vw" }}
                />
              </IconButton>
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
                  {(mute || volume === 0) && (
                    <VolumeOff sx={{ fontSize: "1.75vw" }} />
                  )}
                  {!mute && volume >= 66 && (
                    <VolumeUp sx={{ fontSize: "1.75vw" }} />
                  )}
                  {!mute && volume >= 33 && volume < 66 && (
                    <VolumeDown sx={{ fontSize: "1.75vw" }} />
                  )}
                  {!mute && volume < 33 && volume > 0 && (
                    <VolumeMute sx={{ fontSize: "1.75vw" }} />
                  )}
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
                  <>
                    <List
                      sx={{
                        //width: 30,
                        //height: 100,
                        padding: 2,
                        background: "rgba(0,0,0,0.6)",
                        borderRadius: 1,
                      }}
                    >
                      {changeSubtitles &&
                        subtitlesList.map((value, index) => (
                          <ListItem
                            disablePadding
                            sx={
                              subtitles == value
                                ? { backgroundColor: "#901235" }
                                : {}
                            }
                          >
                            <ListItemButton
                              onClick={() => handleSubtitlesChange(value)}
                            >
                              {value}
                            </ListItemButton>
                          </ListItem>
                        ))}
                      {changeAudio &&
                        audioList.map((value, index) => (
                          <ListItem
                            disablePadding
                            sx={
                              audio == value
                                ? { backgroundColor: "#901235" }
                                : {}
                            }
                          >
                            <ListItemButton
                              onClick={() => handleAudioChange(value)}
                            >
                              {value}
                            </ListItemButton>
                          </ListItem>
                        ))}
                      {changeQuality &&
                        resolutions?.map((value, index) => (
                          <ListItem
                            disablePadding
                            sx={
                              resolution == value
                                ? { backgroundColor: "#901235" }
                                : {}
                            }
                          >
                            <ListItemButton
                              onClick={() => handleQualityChange(value)}
                            >
                              {value + "p"}
                            </ListItemButton>
                          </ListItem>
                        ))}
                      {changeSpeed &&
                        [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(
                          (value, index) => (
                            <ListItem
                              disablePadding
                              sx={
                                speed == value
                                  ? { backgroundColor: "#901235" }
                                  : {}
                              }
                            >
                              <ListItemButton
                                onClick={() => handleSpeedChange(value)}
                              >
                                {value + "x"}
                              </ListItemButton>
                            </ListItem>
                          )
                        )}
                      {settingsMenu && (
                        <>
                          <ListItem>
                            <ListItemButton onClick={handleToggleSubtitles}>
                              <ListItemText primary="Subtitles/CC" />
                              <ArrowForward />
                            </ListItemButton>
                          </ListItem>
                          <ListItem>
                            <ListItemButton onClick={handleToggleAudio}>
                              <ListItemText primary="Audio Language" />
                              <ArrowForward />
                            </ListItemButton>
                          </ListItem>
                          <ListItem>
                            <ListItemButton onClick={handleToggleQuality}>
                              <ListItemText primary="Video Quality" />
                              <ArrowForward />
                            </ListItemButton>
                          </ListItem>
                          <ListItem>
                            <ListItemButton onClick={handleToggleSpeed}>
                              <ListItemText primary="Playback Speed" />
                              <ArrowForward />
                            </ListItemButton>
                          </ListItem>
                        </>
                      )}
                    </List>
                  </>
                }
                open={
                  settingsMenu ||
                  changeAudio ||
                  changeSubtitles ||
                  changeQuality ||
                  changeSpeed
                }
                disableFocusListener
                disableHoverListener
                disableTouchListener
              >
                <IconButton onClick={handleToggleSettingsMenu}>
                  <Settings sx={{ fontSize: "1.75vw" }} />
                </IconButton>
              </Tooltip>

              <IconButton onClick={handleFullscreen}>
                {!fullscreen && <Fullscreen sx={{ fontSize: "1.75vw" }} />}
                {fullscreen && <FullscreenExit sx={{ fontSize: "1.75vw" }} />}
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Controls;
