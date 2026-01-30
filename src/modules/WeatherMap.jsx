import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Dialog, DialogTitle, DialogContent, Typography, Box } from "@mui/material";
import L from "leaflet";

const stations = [
  {
    id: "KALBOAZ30",
    name: "Whitesboro (West)",
    lat: 34.199307,
    lon: -86.0421
  },
  {
    id: "KALGADSD101",
    name: "Gadsden (South)",
    lat: 34.141,
    lon: -85.854
  },
  {
    id: "KALGADSD100",
    name: "Tabor (Bowl)",
    lat: 34.147,
    lon: -85.919
  },
  {
    id: "KALCOLLI15",
    name: "Collinsville (Mid-Valley)",
    lat: 34.263,
    lon: -85.861
  }
];

const WeatherMap = () => {
  const [data, setData] = useState({});
  const [selected, setSelected] = useState(null);

  const fetchStation = async (id) => {
    const url = `https://api.weather.com/v2/pws/observations/current?apiKey=YOUR_KEY&stationId=${id}&numericPrecision=decimal&format=json&units=m`;
    const res = await fetch(url);
    const json = await res.json();
    return json.observations?.[0];
  };

  const loadAll = async () => {
    const results = {};
    for (const s of stations) {
      results[s.id] = await fetchStation(s.id);
    }
    setData(results);
  };

  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 60000);
    return () => clearInterval(interval);
  }, []);

  // Inline Leaflet container style
  const mapStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "8px",
    overflow: "hidden"
  };

  // Leaflet marker icon (also internal)
  const markerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  return (
    <>
      <Box sx={{ width: "100%", mt: 1 }}>
        <MapContainer
          center={[34.20, -85.92]}
          zoom={10}
          scrollWheelZoom={false}
          style={mapStyle}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {stations.map((s) => (
            <Marker
              key={s.id}
              position={[s.lat, s.lon]}
              icon={markerIcon}
              eventHandlers={{
                click: () => setSelected({ ...s, obs: data[s.id] })
              }}
            />
          ))}
        </MapContainer>
      </Box>

      <Dialog open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <DialogTitle>{selected.name}</DialogTitle>
            <DialogContent>
              {selected.obs ? (
                <>
                  <Typography>Temp: {selected.obs.metric.temp}°C</Typography>
                  <Typography>Wind: {selected.obs.metric.windSpeed} m/s</Typography>
                  <Typography>Gust: {selected.obs.metric.windGust} m/s</Typography>
                  <Typography>Humidity: {selected.obs.humidity}%</Typography>
                  <Typography>Pressure: {selected.obs.metric.pressure} hPa</Typography>
                  <Typography sx={{ mt: 1, fontSize: 12 }}>
                    Updated: {selected.obs.obsTimeLocal}
                  </Typography>
                </>
              ) : (
                <Typography>No data available</Typography>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};

export default WeatherMap;
