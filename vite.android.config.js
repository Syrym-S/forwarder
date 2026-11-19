/* global process */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// The website is built as an embedded library; Capacitor needs a complete SPA.
export default defineConfig(({ mode }) => {
  const env = {
    ...loadEnv("ftp", process.cwd(), "VITE_API_URL_"),
    ...loadEnv(mode, process.cwd(), "VITE_"),
    ...process.env,
  };
  const isStaging = mode === "dev";
  const apiUrl = env.VITE_API_URL ||
    (isStaging ? env.VITE_API_URL_DEV : env.VITE_API_URL_PROD);

  if (!apiUrl || !/^https:\/\//.test(apiUrl)) {
    throw new Error(
      "Android build requires an HTTPS VITE_API_URL or VITE_API_URL_DEV/PROD in .env.ftp.",
    );
  }

  const appData = {
    mode: isStaging ? "staging" : "production",
    features: {},
    nonce: "",
  };
  const startPath = isStaging ? "/staging/forwarder/" : "/forwarder/";

  return {
    base: "/",
    plugins: [
      react(),
      {
        name: "android-app-bootstrap",
        transformIndexHtml: {
          order: "pre",
          handler() {
            return [{
              tag: "script",
              injectTo: "head-prepend",
              children: `window.APP_DATA = ${JSON.stringify(appData)};
if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
  window.history.replaceState(null, "", ${JSON.stringify(startPath)} + window.location.search + window.location.hash);
}`,
            }];
          },
        },
      },
    ],
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(apiUrl),
    },
    build: {
      outDir: "dist-android",
      emptyOutDir: true,
      // Retain existing imports of project images and document templates.
      assetsInlineLimit: 0,
    },
  };
});
