/**
 * Prebuild step for the VSCode extension.
 *
 * 1. Builds the shared @morphql/ide-panel bundle (panel.iife.js).
 * 2. Copies panel.iife.js → media/
 * 3. Copies Prism CSS theme → media/  (Prism JS is bundled inside panel.iife.js)
 */

import { copyFile, mkdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const mediaDir = join(__dirname, "media");

await mkdir(mediaDir, { recursive: true });

// ── 1. Build ide-panel (also outputs prism-tomorrow.min.css to dist/) ─
const panelDir = join(__dirname, "../ide-panel");
console.log("Building @morphql/ide-panel...");
execSync("npm run build", { cwd: panelDir, stdio: "inherit" });

// ── 2. Copy panel bundle ──────────────────────────────────────────────
await copyFile(
  join(panelDir, "dist/panel.iife.js"),
  join(mediaDir, "panel.iife.js"),
);
console.log("✔ panel.iife.js copied to media/");

// ── 3. Copy Prism CSS — taken from ide-panel/dist/ (single source) ───
await copyFile(
  join(panelDir, "dist/prism-tomorrow.min.css"),
  join(mediaDir, "prism-tomorrow.min.css"),
);
console.log("✔ prism-tomorrow.min.css copied to media/");
