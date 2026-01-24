import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "MorphQLPlayground",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@morphql/core",
        "@morphql/language-definitions",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@morphql/core": "MorphQLCore",
        },
      },
    },
  },
});
