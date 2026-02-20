// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

// Create theme once
const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

// Bootstrapping function
(async () => {
  // Load Temporal polyfill only if needed
  if (!globalThis.Temporal) {
    const { Temporal } = await import("@js-temporal/polyfill");
    globalThis.Temporal = Temporal;
  }

  // Now mount your React app
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StrictMode>
  );
})();
