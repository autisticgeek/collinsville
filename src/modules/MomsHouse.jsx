import { Grid, Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import NavigationIcon from "@mui/icons-material/Navigation";
import { Temporal } from "@js-temporal/polyfill";

export default function MomsHouse({ lat, lon }) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    let timer;

    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const data = await res.json();
        const cw = data.current_weather;

        setWeather(cw);

        // ---- TEMPORAL LOGIC ----
        // Parse the timestamp as America/Chicago (Alabama local time)
        const zoned = Temporal.ZonedDateTime.from({
          timeZone: "America/Chicago",
          year: Number(cw.time.slice(0, 4)),
          month: Number(cw.time.slice(5, 7)),
          day: Number(cw.time.slice(8, 10)),
          hour: Number(cw.time.slice(11, 13)),
          minute: Number(cw.time.slice(14, 16)),
        });

        // Add interval (seconds)
        const nextUpdate = zoned.add({ seconds: cw.interval });

        // Convert to Instant (epoch)
        const nextInstant = nextUpdate.toInstant();

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
      <Grid item xs={12} sm={6}>
        <Typography>Loading weather…</Typography>
      </Grid>
    );
  }

  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Stack height="100%" alignItems="center" justifyContent="center">
        <Typography variant="h3">Current Weather</Typography>

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

        <Typography variant="body1" sx={{ mt: 2 }}>
          Report time (Alabama):{" "}
          {new Date(weather.time).toLocaleString("en-US", {
            timeZone: "America/Chicago",
          })}
        </Typography>
      </Stack>
    </Grid>
  );
}
