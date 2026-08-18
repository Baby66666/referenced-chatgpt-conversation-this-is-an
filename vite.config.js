import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        project01: resolve(import.meta.dirname, 'project-01.html'),
        project02: resolve(import.meta.dirname, 'project-02.html'),
        project03: resolve(import.meta.dirname, 'project-03.html'),
      },
    },
  },
})
