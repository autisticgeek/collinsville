// src/App.jsx
import { Container, Divider, Stack } from "@mui/material";
import AlabamaCams from "./modules/AlabamaCams";
import WeatherMap from "./modules/WeatherMap";

export default function App() {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack spacing={5}>
        <AlabamaCams />
        <WeatherMap />
      </Stack>
    </Container>
  );
}
