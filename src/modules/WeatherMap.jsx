import { Box } from "@mui/material";

export default function WeatherMap() {
  return (
    <Box sx={{ position: "relative", width: "100%", height: 600 }}>
      {/* Overlay blocks ALL interaction but allows page scroll */}

      <iframe
        src="https://www.rainviewer.com/map.html?loc=34.221,-85.847,10&o=1&c=1&layer=radar&sm=1&sn=1&animation=1&hideMenu=1&hideLegend=1&hideToolbar=1&focus=1&interactive=0"
        width="100%"
        height="100%"
        style={{ border: "none" }}
        loading="lazy"
        allowFullScreen
      />
    </Box>
  );
}
