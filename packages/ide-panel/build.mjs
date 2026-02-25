import { build } from "esbuild";
import { copyFile, mkdir } from "fs/promises";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

await mkdir("dist", { recursive: true });

await build({
  entryPoints: ["src/panel.ts"],
  bundle: true,
  format: "iife",
  outfile: "dist/panel.iife.js",
  platform: "browser",
  target: "es2017",
  minify: false, // keep readable for debugging
  // Prism auto-loads language components via dynamic require — stub it out
  // since we import the languages explicitly.
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

console.log("✔ ide-panel built → dist/panel.iife.js");

// Copy Prism CSS theme to dist/ so JetBrains Gradle can pick it up alongside panel.iife.js
const prismTheme = require.resolve("prismjs/themes/prism-tomorrow.min.css");
await copyFile(prismTheme, "dist/prism-tomorrow.min.css");
console.log("✔ prism-tomorrow.min.css copied to dist/");
