import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Project-page subpath on GitHub Pages (github.io/<repo>/). Keep in sync with
  // the repo name and the BrowserRouter basename.
  base: '/rtx6kpro-atlas/',
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    allowedHosts: ['.ts.net', 'elliots-macbook-air'],
  },
})
