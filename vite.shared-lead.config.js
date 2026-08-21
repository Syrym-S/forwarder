import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  root: "./shared",

  base: "assets/js/shared",

  publicDir: "../public",

  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "assets"),
    },
  },

  build: {
    outDir: "../dist-shared",
    emptyOutDir: true,

    rollupOptions: {
      output: {
        entryFileNames: "index.js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name][extname]",
      },
    },
  },
});
