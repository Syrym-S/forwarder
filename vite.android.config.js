/* global process */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const productionConsole = `({${[
  "assert", "clear", "count", "countReset", "debug", "dir", "dirxml", "error",
  "group", "groupCollapsed", "groupEnd", "info", "log", "profile", "profileEnd",
  "table", "time", "timeEnd", "timeLog", "timeStamp", "trace", "warn",
].map((method) => `${method}(){}`).join(",")}})`;

// The website is built as an embedded library; Capacitor needs a complete SPA.
export default defineConfig(({ mode }) => {
  const env = {
    ...loadEnv("ftp", process.cwd(), "VITE_API_URL_"),
    ...loadEnv(mode, process.cwd(), "VITE_"),
    ...process.env,
  };
  const isStaging = mode === "dev";
  const isProduction = mode === "prod";
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
        name: "remove-production-native-console-handler",
        transform(code, id) {
          if (!isProduction || !id.replaceAll("\\", "/").endsWith("/@capacitor/core/dist/index.js")) {
            return null;
          }
          return {
            code: code.replace(
              "const handleError = (err) => win.console.error(err);",
              "const handleError = () => {};",
            ),
            map: null,
          };
        },
      },
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
    css: isProduction ? {
      postcss: {
        plugins: [{
          postcssPlugin: "remove-production-css-comments",
          Comment(comment) {
            comment.remove();
          },
        }],
      },
    } : undefined,
    build: {
      outDir: "dist-android",
      emptyOutDir: true,
      sourcemap: false,
      minify: isProduction ? "terser" : "oxc",
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          global_defs: Object.fromEntries(
            ["console", "window.console", "globalThis.console", "self.console"]
              .map((name) => [`@${name}`, productionConsole]),
          ),
        },
        format: {
          comments: false,
        },
      } : undefined,
      // Retain existing imports of project images and document templates.
      assetsInlineLimit: 0,
    },
  };
});
