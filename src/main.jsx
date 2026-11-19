import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { CssBaseline } from "@mui/material";
import { createAuthSession, isAuthPath } from "./services/auth-session.js";

async function mountApp() {
  const isAuthPage = isAuthPath(window.location.pathname);

  if (!isAuthPage) {
    const { api } = await import("./app/client.js");
    const session = createAuthSession({
      api,
      location: window.location,
      getMode: () => window.APP_DATA?.mode,
    });

    if (!(await session.checkBeforeMount())) return;
  }

  const root = createRoot(document.getElementById("root"));

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
