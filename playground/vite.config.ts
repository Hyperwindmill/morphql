import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'js-beautify': path.resolve(__dirname, 'node_modules/js-beautify/js/lib/beautify.js'),
      'chevrotain': path.resolve(__dirname, 'node_modules/chevrotain/lib/chevrotain.mjs'),
      'fast-xml-parser': path.resolve(__dirname, 'node_modules/fast-xml-parser/src/fxp.js')
    },
  },
})
