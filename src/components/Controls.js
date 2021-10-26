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

const Controls = () => {
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
          <IconButton>
            <Pause />
          </IconButton>
          <IconButton>
            <VolumeUp />
          </IconButton>
          <Slider min={0} max={100} value={0} />
        </Grid>
        <Grid item xs={9}>
          <Slider min={0} max={100} value={0} />
        </Grid>
        <Grid item>
          <IconButton>
            <Fullscreen />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Controls;
