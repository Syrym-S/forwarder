import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const viteCli = fileURLToPath(
  new URL("../node_modules/vite/bin/vite.js", import.meta.url),
);

// Build the standalone page and the bundle loaded by the existing WordPress page.
for (const config of ["vite.config.js", "vite.embedded.config.js"]) {
  const result = spawnSync(
    process.execPath,
    [viteCli, "build", ...process.argv.slice(2), "--config", config],
    { stdio: "inherit" },
  );

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
