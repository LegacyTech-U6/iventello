import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import viteCompression from 'vite-plugin-compression'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
   process.env.STORYBOOK ? null : vueDevTools(),
    tailwindcss(),

    // gzip + brotli
    viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
    viteCompression({ algorithm: 'gzip', ext: '.gz' }),

    Components({
      resolvers: [NaiveUiResolver()]
    }),

    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // 6MB
      },
      manifest: {
        name: 'Iventello',
        short_name: 'Iventello',
        description: 'Modern multi enterprise stock magement app',
        theme_color: '#4DBA87',
        background_color: '#ffffff',
        display: 'standalone', // plein écran
        scope: '/',
        start_url: '/login',
        icons: [
          {
            src: '/iventello.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/iventello.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'naive-ui': 'naive-ui/es',
    },
  },

  build: {
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('naive-ui')) return 'naive-ui'
            if (id.includes('chart.js')) return 'charts'
            if (id.includes('vue')) return 'vendor-vue'
            return 'vendor'
          }
        }
      }
    }
  }
})
