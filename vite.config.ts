import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

interface CatalogManifestConfig {
  config: {
    app_name: string
    city: string
  }
}

const catalog = JSON.parse(
  readFileSync(resolve(import.meta.dirname, 'public', 'db.json'), 'utf8'),
) as CatalogManifestConfig

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: catalog.config.app_name,
      short_name: catalog.config.app_name.slice(0, 12),
      description: `Galeria local de ${catalog.config.city}`,
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      scope: '/',
      lang: 'pt-BR',
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      skipWaiting: true,
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      navigateFallback: '/index.html',
      runtimeCaching: [
        {
          urlPattern: /\/db\.json$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'catalog',
            expiration: {
              maxEntries: 1,
              maxAgeSeconds: 60 * 60 * 24,
            },
            cacheableResponse: { statuses: [200] },
          },
        },
        {
          urlPattern: /\/images\/.*\.(?:png|jpe?g|webp|avif|svg)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'catalog-images',
            expiration: {
              maxEntries: 300,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: ({ request }) => request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'app-shell',
            networkTimeoutSeconds: 3,
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 7,
            },
          },
        },
      ],
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})