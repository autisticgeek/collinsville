// src/components/VideoPlayer.jsx
import React, { useEffect, useState } from "react";
import { Typography, Button, Box } from "@mui/material";
import { useHlsPlayer } from "../hooks/useHlsPlayer";
import { Temporal } from "@js-temporal/polyfill";

const VideoPlayer = React.memo(function VideoPlayer({
  src,
  id = null,
  activeId = null,
  name = null,
  place = null,
  state = null,
  style = null,
  showButtons = true,
}) {
  // console.log({ src, id, activeId, setActiveId, name, place });
  const [refreshKey, setRefreshKey] = useState(Temporal.Now.instant());

  const videoRef = useHlsPlayer(
    `${import.meta.env.VITE_WORKER_URL}/hazcams?url=${encodeURIComponent(src)}`,
    refreshKey
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let lastTime = video.currentTime;
    let stallCheck;

    const checkStall = () => {
      if (video.playbackRate > 1.0) {
        if (Math.abs(video.currentTime - lastTime) < 0.01) {
          video.playbackRate = 1.0;
        }
        lastTime = video.currentTime;
      }
    };

    video.addEventListener("play", () => {
      stallCheck = setInterval(checkStall, 3000); // check every 3s
    });

    video.addEventListener("pause", () => {
      clearInterval(stallCheck);
    });

    return () => {
      clearInterval(stallCheck);
      video.removeEventListener("play", checkStall);
      video.removeEventListener("pause", checkStall);
    };
  }, [videoRef]);

  return (
    <Box sx={{ textAlign: "center" }}>
      <video
        ref={videoRef}
        controls
        // autoPlay
        muted={activeId !== id}
        style={style ? { ...style } : { width: "100%" }}
        referrerPolicy="no-referrer"
      />
      {showButtons && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            marginTop: "8px",
          }}
        >
          <Typography variant="h6">
            {name?.trim()}
            {place && ` — ${place.trim()}`}
            {state && `, ${state.trim()}`}
          </Typography>

          <Button
            variant="contained"
            onClick={() => setRefreshKey(Temporal.Now.instant())}
          >
            Refresh
          </Button>
        </Box>
      )}
    </Box>
  );
});

export default VideoPlayer;
