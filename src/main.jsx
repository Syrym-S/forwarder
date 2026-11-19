import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { CssBaseline } from "@mui/material";

async function mountApp() {
  const root = createRoot(document.getElementById("root"));
  const isAuthPage = /^\/(?:staging\/)?auth(?:\/|$)/.test(window.location.pathname);

  if (isAuthPage) {
    const { default: AuthApp } = await import("./auth/Forwarder");

    root.render(
      <StrictMode>
        <AuthApp />
      </StrictMode>,
    );
    return;
  }

  const [{ default: App }, { default: LocalizedThemeProvider }] = await Promise.all([
    import("./App"),
    import("./app/theme/localized-theme-provider"),
    import("./leaflet-icon"),
  ]);

  root.render(
    <StrictMode>
      <LocalizedThemeProvider>
        <CssBaseline />
        <App />
      </LocalizedThemeProvider>
    </StrictMode>,
  );
}

mountApp();
