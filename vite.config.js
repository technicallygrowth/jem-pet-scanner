import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Jem Pet Scanner',
        short_name: 'Pet Scanner',
        description: 'Scan a pet-food barcode and see a plain-language, layered analysis.',
        theme_color: '#9b046f',
        background_color: '#f6bda7',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Caches the app shell (HTML/CSS/JS/fonts) so the installed app opens
        // even with no signal; scanning itself still needs the camera live.
        globPatterns: ['**/*.{js,css,html,woff2,png,svg}'],
      },
    }),
  ],
})
