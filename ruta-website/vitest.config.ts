import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // Mirrors the `@/*` path alias from tsconfig.json.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    // The suite covers server logic — pure functions over domain types, so no
    // DOM is needed. Component tests would additionally require jsdom.
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
