/**
 * Copies the Prism.js files needed by the Live Panel WebView into media/.
 * Runs as part of the prebuild step so the files are available in the VSIX.
 */

import { copyFile, mkdir } from "fs/promises";
import { createRequire } from "module";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Locate prismjs root (works in workspaces where it may be hoisted)
const prismRoot = dirname(require.resolve("prismjs/package.json"));
const mediaDir = join(__dirname, "media");

await mkdir(mediaDir, { recursive: true });

const files = [
  ["prism.js", "prism.js"],
  ["components/prism-javascript.js", "prism-javascript.js"],
  ["components/prism-json.js", "prism-json.js"],
  ["components/prism-markup.js", "prism-markup.js"],
  ["themes/prism-tomorrow.min.css", "prism-tomorrow.min.css"],
];

for (const [src, dest] of files) {
  await copyFile(join(prismRoot, src), join(mediaDir, dest));
}

console.log("✔ Prism files copied to media/");
