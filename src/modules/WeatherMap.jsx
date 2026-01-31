import { Box } from "@mui/material";

export default function WeatherMap() {
  return (
    <Box sx={{ position: "relative", width: "100%", height: 600 }}>
      {/* Overlay blocks ALL interaction but allows page scroll */}

      <iframe
        src="https://www.rainviewer.com/map.html?loc=34.2215,-85.8407,10&oCS=1&c=3&o=83&lm=1&layer=radar&sm=1&sn=1"
        width="100%"
        height="100%"
        style={{ border: "none" }}
        loading="lazy"
        allowFullScreen
      />
    </Box>
  );
}
