// src/hooks/useHlsPlayer.js
import { useEffect, useRef } from "react";
import Hls from "hls.js";

export function useHlsPlayer(src, refreshKey) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        autoStartLoad: false,     // IMPORTANT: do not start automatically
        maxBufferLength: 12,      // maximum seconds to buffer ahead
        maxMaxBufferLength: 12,
        backBufferLength: 0,      // no extra back buffer
        liveSyncDuration: 6,      // sync to ~1 segment
        liveMaxLatencyDuration: 12,

        xhrSetup: (xhr) => {
          xhr.setRequestHeader(
            "x-autisticgeek-key",
            import.meta.env.VITE_WORKER_KEY
          );
        },
      });

      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      // Step 1: start initial load immediately to show first frame
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        hls.startLoad(-1); // fetch first segment
      });

      // Step 2: keep one segment ahead, stop when buffered enough
      hls.on(Hls.Events.FRAG_BUFFERED, () => {
        if (!video) return;

        const bufferedAhead = video.buffered.length
          ? video.buffered.end(video.buffered.length - 1) - video.currentTime
          : 0;

        if (bufferedAhead < 12) {
          hls.startLoad(); // fetch next segment
        } else {
          hls.stopLoad(); // stop after ~2 segments ahead
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, refreshKey]);

  return { videoRef, hlsRef };
}