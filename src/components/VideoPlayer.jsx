// src/components/VideoPlayer.jsx
import React, { useEffect, useState } from "react";
import { Typography, Button, Box } from "@mui/material";
import { useHlsPlayer } from "../hooks/useHlsPlayer";
import { Temporal } from "@js-temporal/polyfill";

const VideoPlayer = React.memo(function VideoPlayer({
  src,
  name = null,
  place = null,
  state = null,
  style = null,
  showButtons = true,
}) {
  const [refreshKey, setRefreshKey] = useState(Temporal.Now.instant());

  const { videoRef, hlsRef } = useHlsPlayer(
    `${import.meta.env.VITE_WORKER_URL}/hazcams?url=${encodeURIComponent(src)}`,
    refreshKey
  );

  // -----------------------------
  // Play / Pause control
  // -----------------------------
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      const hls = hlsRef.current;
      if (!hls) return;

      // Resume live loading from live edge
      hls.startLoad(-1);
    };

    const handlePause = () => {
      const hls = hlsRef.current;
      if (!hls) return;

      // Stop future segment downloads
      hls.stopLoad();
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [videoRef, hlsRef]);

  // -----------------------------
  // Stall protection (your original logic)
  // -----------------------------
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

    const onPlay = () => {
      stallCheck = setInterval(checkStall, 3000);
    };

    const onPause = () => {
      clearInterval(stallCheck);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      clearInterval(stallCheck);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [videoRef]);

  return (
    <Box sx={{ textAlign: "center" }}>
      <video
        ref={videoRef}
        autoPlay
        controls
        muted={true}
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
