import { useEffect, useRef } from "react";
import Hls from "hls.js";

export function useHlsPlayer(src, refreshKey) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls;

    if (Hls.isSupported()) {
      hls = new Hls({
        // Inject API key into EVERY request (playlist + segments)
        xhrSetup: (xhr) => {
          xhr.setRequestHeader(
            "x-autisticgeek-key",
            import.meta.env.VITE_WORKER_KEY
          );
        },
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
      });

    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS
      video.src = src;
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [src, refreshKey]);

  return videoRef;
}
