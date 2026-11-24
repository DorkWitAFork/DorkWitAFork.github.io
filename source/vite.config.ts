import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

export default defineConfig({
  plugins: [react(), {
    name: 'legacy-pages',
    apply: 'build',
    generateBundle() {
      // Pages uploads dist, so include the existing bookmarks without copying the repo.
      for (const fileName of ['csc138/index.html', 'csc173/index.html', 'csc173_final_practice.html', 'site.css', 'assignment_6_style.css']) {
        this.emitFile({ type: 'asset', fileName, source: readFileSync(new URL(`../${fileName}`, import.meta.url)) })
      }
    },
  }],
})
