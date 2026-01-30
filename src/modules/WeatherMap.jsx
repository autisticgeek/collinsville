import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

export default function WeatherMap() {
  const iframeRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const iframe = iframeRef.current;

    if (!overlay || !iframe) return;

    // Forward scroll wheel events to the iframe
    const forwardWheel = (e) => {
      e.preventDefault();

      iframe.contentWindow?.dispatchEvent(
        new WheelEvent("wheel", {
          deltaY: e.deltaY,
          deltaX: e.deltaX,
          clientX: e.clientX,
          clientY: e.clientY,
          bubbles: true,
          cancelable: true,
        })
      );
    };

    overlay.addEventListener("wheel", forwardWheel, { passive: false });

    return () => {
      overlay.removeEventListener("wheel", forwardWheel);
    };
  }, []);

  return (
    <Box sx={{ position: "relative", width: "100%", height: 600 }}>
      {/* Overlay blocks dragging but forwards scroll */}
      <Box
        ref={overlayRef}
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background: "transparent",
          cursor: "default",
          // Block all pointer events (dragging, clicking)
          pointerEvents: "auto",
        }}
      />

      <iframe
        ref={iframeRef}
        src="https://staticbaronwebapps.velocityweather.com/digitial_wx/widgets/mapv2/index.html?initjson=/digitial_wx/widgets/dcms/5fb0a27c-3405-4e0e-b2ad-1bbbdec65e04/preview/init.json#10/34.221/-85.847"
        width="100%"
        height="100%"
        style={{ border: "none" }}
        loading="lazy"
        allowFullScreen
      />
    </Box>
  );
}
