// src/modules/AlabamaCams.jsx
import { Box } from "@mui/material";
import VideoPlayer from "../components/VideoPlayer";

export default function AlabamaCams() {
  const cams = [
    {
      id: "gadsden",
      name: "Gadsden Hazcam",
      place: "Gadsden",
      state: "AL",
      src: "https://video.hazcams.com/gadsden-al-us-002/index.m3u8",
    },
    {
      id: "albertville",
      name: "Albertville Hazcam",
      place: "Albertville",
      state: "AL",
      src: "https://video.hazcams.com/albertville-al-us-001/index.m3u8",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 2,
        mb: 5,
      }}
    >
      {cams.map((cam) => (
        <VideoPlayer
          key={cam.id}
          id={cam.id}
          src={cam.src}
          name={cam.name}
          place={cam.place}
          state={cam.state}
          style={{ width: "100%", borderRadius: "8px" }}
        />
      ))}
    </Box>
  );
}
