import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { firebaseWorkerPlugin } from "./tooling/firebase-worker-plugin.js";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), firebaseWorkerPlugin()],
  base: "/forwarder",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
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
});
