// src/modules/AlabamaCams.jsx
import { Grid } from "@mui/material";
import VideoPlayer from "../components/VideoPlayer";
import MomsHouse from "./MomsHouse";

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
    {
      id: "noccalula_falls",
      name: "Noccalula Falls",
      place: "Gadsden",
      state: "AL",
      src: "https://video.hazcams.com/gadsden-al-us-001/main_stream.m3u8",
    },
  ];

  return (
    <Grid container spacing={2}>
      
        <MomsHouse lat="34.222" lon="-85.848" />
      {cams.map((cam) => (
        <Grid key={cam.id} size={{ xs: 12, sm: 6 }}>
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
