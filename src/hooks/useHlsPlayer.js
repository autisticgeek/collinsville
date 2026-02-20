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
        autoStartLoad: false,   // IMPORTANT
        maxBufferLength: 6,     // ~1 segment
        maxMaxBufferLength: 6,
        backBufferLength: 0,
        liveSyncDuration: 6,
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

      // Load ONLY enough to show first frame
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        hls.startLoad(-1);

        // Stop after short time so only 1 segment loads
        setTimeout(() => {
          hls.stopLoad();
        }, 800);
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