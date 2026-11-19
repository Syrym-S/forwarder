import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { firebaseWorkerPlugin } from "./tooling/firebase-worker-plugin.js";

const apiUrls = loadEnv("ftp", process.cwd(), "VITE_API_URL_");

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [react(), firebaseWorkerPlugin()],
  base: command === "serve" ? "/" : "/forwarder",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "import.meta.env.VITE_API_URL": JSON.stringify(
      mode === "dev"
        ? apiUrls.VITE_API_URL_DEV
        : apiUrls.VITE_API_URL_PROD,
    ),
  },
  build: {
    minify: "terser",

    terserOptions: {
      compress: {
        // drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    lib: {
      entry: "src/main.jsx",
      formats: ["iife"],
      name: "ForwarderApp",
      fileName: () => "index.js",
      cssFileName: "index",
    },
  },
}));
