import { Grid, Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import NavigationIcon from "@mui/icons-material/Navigation";
import { LineChart } from "@mui/x-charts/LineChart";

const Temporal = globalThis.Temporal;

// Daytime weather icons
const weatherIconsDay = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️❄️",
  51: "🌦️",
  61: "🌧️",
  71: "❄️",
  80: "🌦️",
  95: "⛈️",
};

// Nighttime weather icons
const weatherIconsNight = {
  0: "🌙", // will replace with moon phase if clear
  1: "🌙✨",
  2: "🌙⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️❄️",
  51: "🌦️",
  61: "🌧️",
  71: "❄️",
  80: "🌦️",
  95: "⛈️",
};

// Weather description labels
const weatherLabels = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime Fog",
  51: "Light Drizzle",
  61: "Rain",
  71: "Snow",
  80: "Rain Showers",
  95: "Thunderstorm",
};

// Returns moon emoji based on current lunar phase
function getMoonPhase(date = new Date()) {
  const lunarCycle = 29.53058867; // average length in days
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14));
  const diff = (date - knownNewMoon) / 1000 / 60 / 60 / 24; // days
  const phase = ((diff % lunarCycle) + lunarCycle) % lunarCycle;

  let phaseIcon = "🌑";

  if (phase < 1.84566) phaseIcon = "🌑"; // New Moon
  if (phase < 5.53699) phaseIcon = "🌒"; // Waxing Crescent
  if (phase < 9.22831) phaseIcon = "🌓"; // First Quarter
  if (phase < 12.91963) phaseIcon = "🌔"; // Waxing Gibbous
  if (phase < 16.61096) phaseIcon = "🌕"; // Full Moon
  if (phase < 20.30228) phaseIcon = "🌖"; // Waning Gibbous
  if (phase < 23.99361) phaseIcon = "🌗"; // Last Quarter
  if (phase < 27.68493) phaseIcon = "🌘"; // Waning Crescent
  return phaseIcon;
}

export default function MomsHouse({ lat, lon }) {
  const [weather, setWeather] = useState(null);
  const HOURS_TO_SHOW = 11;

  const [hours, setHours] = useState([]);
  const [tempsF, setTempsF] = useState([]);

  // -----------------------------
  // Live/current weather fetch
  // -----------------------------
  useEffect(() => {
    let timer;

    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=GMT`
        );
        const data = await res.json();
        const cw = data.current_weather;

        const readingInstant = Temporal.Instant.from(cw.time + "Z");
        setWeather({ ...cw, readingInstant });

        // Schedule next fetch
        const nextInstant = readingInstant.add({ seconds: cw.interval });
        const now = Temporal.Now.instant();
        let delayMs = nextInstant.epochMilliseconds - now.epochMilliseconds;
        delayMs = Math.max(delayMs, 5000);

        timer = setTimeout(fetchWeather, delayMs);
      } catch (err) {
        console.error("Weather fetch error:", err);
        timer = setTimeout(fetchWeather, 60000);
      }
    }

    fetchWeather();
    return () => clearTimeout(timer);
  }, [lat, lon]);

  // -----------------------------
  // Hourly forecast fetch
  // -----------------------------
  useEffect(() => {
    let interval;

    async function loadWeather() {
      try {
        const pointRes = await fetch(
          `https://api.weather.gov/points/${lat},${lon}`
        );
        const pointData = await pointRes.json();
        const hourlyUrl = pointData.properties.forecastHourly;

        const hourlyRes = await fetch(hourlyUrl);
        const hourlyData = await hourlyRes.json();
        const periods = hourlyData.properties.periods.slice(0, HOURS_TO_SHOW);

        const hourLabels = periods.map((p) =>
          new Date(p.startTime).toLocaleTimeString([], { hour: "numeric" })
        );

        const temps = periods.map((p) => p.temperature); // F directly

        setHours(hourLabels);
        setTempsF(temps);
      } catch (err) {
        console.error("Hourly forecast fetch error:", err);
      }
    }

    loadWeather();
    interval = setInterval(loadWeather, 600_000);
    return () => clearInterval(interval);
  }, [lat, lon]);

  const xValues = hours.map((_, i) => i);
  const yMin = tempsF.length > 0 ? Math.min(...tempsF) - 2 : 0;
  const yMax = tempsF.length > 0 ? Math.max(...tempsF) + 2 : 100;

  if (!weather) {
    return (
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography>Loading weather…</Typography>
      </Grid>
    );
  }

  // -----------------------------
  // Determine icon
  // -----------------------------
  const isNight = weather.is_day === 0;
  let weatherIcon;

  if (isNight && weather.weathercode < 3) {
    weatherIcon = getMoonPhase();
  } else if (isNight) {
    weatherIcon = weatherIconsNight[weather.weathercode] || "❓";
  } else {
    weatherIcon = weatherIconsDay[weather.weathercode] || "❓";
  }

  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Stack height="100%" alignItems="center" justifyContent="center">
          <Typography gutterBottom variant="h3">
            {weatherIcon} {weatherLabels[weather.weathercode] || "Unknown"}
          </Typography>

          <Typography gutterBottom variant="h4">
            Temperature: {((weather.temperature * 9) / 5 + 32).toFixed(0)}°F
          </Typography>

          <Typography variant="h4">
            Wind:{" "}
            <NavigationIcon
              style={{
                transform: `rotate(${weather.winddirection + 180}deg)`,
                transition: "transform 0.3s ease",
              }}
            />
            {(weather.windspeed * 0.621371).toFixed(0)} mph
          </Typography>

          <Typography variant="body2" sx={{ mt: 1 }}>
            Checked at{" "}
            {new Date(
              weather.readingInstant.epochMilliseconds
            ).toLocaleTimeString()}{" "}
            your time.
          </Typography>
        </Stack>
      </Grid>

      {tempsF.length > 0 && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <LineChart
          height={350}
            grid={{ vertical: true, horizontal: true }}
            disableAxisListener
            xAxis={[
              {
                data: xValues,
                valueFormatter: (i) => hours[i],
              },
            ]}
            yAxis={[
              {
                min: yMin,
                max: yMax,
                width: 40,
                valueFormatter: (f) => `${f.toFixed(0)}°F`,
              },
            ]}
            series={[
              {
                data: tempsF,
                showMark: false,
                color: "#1976d2",
              },
            ]}
          />
        </Grid>
      )}
    </>
  );
}
