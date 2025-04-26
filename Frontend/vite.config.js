import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),VitePWA({
    registerType: "autoUpdate",
    includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png", "favicon.ico",
      "apple-touch-icon.png",
      "android-chrome-192x192.png",
      "android-chrome-512x512.png"],
    manifest: {
      name: "JeevaFit Health App",
      short_name: "JeevaFit",
      description: "Track your health even offline!",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
      scope: "/",
      start_url: "/",
      icons: [
        {
          src: "/web-app-manifest-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/web-app-manifest-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: ({ url }) => url.origin === self.origin,
          handler: "CacheFirst",
          options: {
            cacheName: "local-cache",
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
            },
          },
        },
      ],
    },
  }),],
  server: {
    proxy: {
      '/api': {
        target: 'https://wsearch.nlm.nih.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/ws/query'),
      },
    },
  },
})
