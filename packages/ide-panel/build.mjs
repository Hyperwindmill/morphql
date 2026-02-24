import { build } from "esbuild";
import { mkdir } from "fs/promises";

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
