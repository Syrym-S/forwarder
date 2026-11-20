import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Alert, Button, CssBaseline } from "@mui/material";
import { Capacitor } from "@capacitor/core";
import { createAuthSession, isAuthPath } from "./services/auth-session.js";
import { loadNativeAppData } from "./services/native-app-bootstrap.js";

async function mountApp() {
  try {
    // Populate the nonce before either API client reads APP_DATA.
    window.APP_DATA = await loadNativeAppData({
      isNative: Capacitor.isNativePlatform(),
      apiUrl: import.meta.env.VITE_API_URL,
      appData: window.APP_DATA,
    });
  } catch {
    createRoot(document.getElementById("root")).render(
      <Alert severity="error" action={
        <Button color="inherit" onClick={() => window.location.reload()}>
          Повторить
        </Button>
      }>
        Не удалось подключиться к серверу. Проверьте соединение и повторите попытку.
      </Alert>,
    );
    return;
  }

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
