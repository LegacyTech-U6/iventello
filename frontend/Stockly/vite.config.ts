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
  base: './',
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
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'], // Liste tes assets ici
  workbox: {
    maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // 6MB (C'est bien, mais attention à la performance)
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'] // S'assure que ces fichiers sont mis en cache
  },
  manifest: {
    name: 'Iventello',
    short_name: 'Iventello',
    description: 'Modern multi enterprise stock management app', // Corrigé "magement" -> "management"
    theme_color: '#4DBA87',
    background_color: '#ffffff',
    display: 'standalone',
    scope: '/',
    start_url: '/',
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
      },
      {
        src: '/iventello.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
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
      output: {}
    }
  }
})
