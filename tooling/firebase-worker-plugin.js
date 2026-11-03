import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { loadEnv } from "vite";
import { readFirebaseConfig } from "../src/services/firebase-config.js";

const require = createRequire(import.meta.url);
const sdkVersion = require("firebase/package.json").version;

export function firebaseWorkerPlugin() {
  let source;
  return {
    name: "firebase-messaging-worker",
    configResolved(config) {
      const env = loadEnv(config.mode, config.envDir, "VITE_");
      source = readFileSync(
        new URL("./firebase-messaging-sw.js.template", import.meta.url),
        "utf8",
      )
        .replace(
          "__FIREBASE_CONFIG__",
          JSON.stringify({
            production: readFirebaseConfig(env),
            staging: readFirebaseConfig(env, { staging: true }),
          }),
        )
        .replaceAll("__FIREBASE_SDK_VERSION__", sdkVersion);
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "firebase-messaging-sw.js",
        source,
      });
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split("?")[0];
        if (
          path !== "/firebase-messaging-sw.js" &&
          path !== "/staging/firebase-messaging-sw.js"
        ) {
          return next();
        }
        res.setHeader("Content-Type", "application/javascript");
        res.setHeader("Cache-Control", "no-cache");
        res.end(source);
      });
    },
  };
}
