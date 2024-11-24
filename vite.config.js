import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'jsdom',  // Use jsdom for testing
    globals: true,          // Optional: Allows you to use globals like `window`, `document`, etc.
  },
});