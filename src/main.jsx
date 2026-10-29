import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { CssBaseline } from "@mui/material";
import LocalizedThemeProvider from "./app/theme/localized-theme-provider";
import "./leaflet-icon";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LocalizedThemeProvider>
      <CssBaseline />
      <App />
    </LocalizedThemeProvider>
  </StrictMode>,
);
