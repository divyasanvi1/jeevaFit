import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["robots.txt", "/JeevaFit_logo.svg"],
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
            src: "/JeevaFit_logo.svg",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/JeevaFit_logo.svg",
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
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://wsearch.nlm.nih.gov",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/ws/query"),
      },
    },
  },
});
