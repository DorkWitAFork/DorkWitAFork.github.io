import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.pw.ts',
  use: { baseURL: 'http://127.0.0.1:4173' },
  webServer: {
    // Serve exactly the uploaded files. A dev server's SPA fallback can hide missing legacy pages.
    command: 'python3 -m http.server 4173 --bind 127.0.0.1 --directory dist',
    url: 'http://127.0.0.1:4173/',
  },
})
