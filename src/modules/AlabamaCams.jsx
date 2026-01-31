// src/modules/AlabamaCams.jsx
import { Grid } from "@mui/material";
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
    <Grid container spacing={2}>
      {cams.map((cam) => (
        <Grid key={cam.id} size={{ xs: 12, md: 6 }}>
          <VideoPlayer
            id={cam.id}
            src={cam.src}
            name={cam.name}
            place={cam.place}
            state={cam.state}
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </Grid>
      ))}
    </Grid>
  );
}
