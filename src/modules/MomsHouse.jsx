import { Grid, Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import NavigationIcon from "@mui/icons-material/Navigation";

const Temporal = globalThis.Temporal;

export default function MomsHouse({ lat, lon }) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    let timer;

    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=GMT`
        );

        const data = await res.json();
        const cw = data.current_weather;

        // Convert GMT timestamp to a Temporal.Instant
        const readingInstant = Temporal.Instant.from(cw.time + "Z");

        // Store enriched weather object
        setWeather({
          ...cw,
          readingInstant,
        });

        // Compute next update time
        const nextInstant = readingInstant.add({ seconds: cw.interval });

        // Compute delay from now
        const now = Temporal.Now.instant();
        let delayMs = nextInstant.epochMilliseconds - now.epochMilliseconds;

        // Safety: never schedule less than 5 seconds
        delayMs = Math.max(delayMs, 5000);

        timer = setTimeout(fetchWeather, delayMs);
      } catch (err) {
        console.error("Weather fetch error:", err);

        // Retry in 1 minute on failure
        timer = setTimeout(fetchWeather, 60000);
      }
    }

    fetchWeather();
    return () => clearTimeout(timer);
  }, [lat, lon]);

  if (!weather) {
    return (
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography>Loading weather…</Typography>
      </Grid>
    );
  }

  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Stack height="100%" alignItems="center" justifyContent="center">
        <Typography variant="h3">Pine Grove</Typography>

        <Typography gutterBottom variant="h4">
          Temperature: {weather.temperature}°F
        </Typography>

        <Typography variant="h4">
          Wind:{" "}
          <NavigationIcon
            style={{
              transform: `rotate(${weather.winddirection + 180}deg)`,
              transition: "transform 0.3s ease",
            }}
          />
          {weather.windspeed} mph
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          Local time:{" "}
          {new Date(
            weather.readingInstant.epochMilliseconds
          ).toLocaleTimeString()}
        </Typography>
      </Stack>
    </Grid>
  );
}
