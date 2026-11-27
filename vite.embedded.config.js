import { defineConfig } from "vite";
import webConfig from "./vite.config.js";

export default defineConfig((configEnv) => {
  const config = webConfig(configEnv);

  return {
    ...config,
    build: {
      ...config.build,
      emptyOutDir: false,
      lib: {
        entry: "src/main.jsx",
        formats: ["iife"],
        name: "ForwarderApp",
        fileName: () => "index.js",
        cssFileName: "index",
      },
    },
  };
});
