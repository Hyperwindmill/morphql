import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts', '**/*.spec.ts'],
  },
  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
