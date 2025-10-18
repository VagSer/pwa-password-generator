import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'splash-screen.png'
      ],
      manifest: {
        name: 'Password Generator',
        short_name: 'PasswordGen',
        description: 'Умный генератор безопасных паролей',
        theme_color: '#2c3e50',
        background_color: '#ecf0f1',
        display: 'standalone',
        start_url: '/',
        orientation: 'portrait-primary',
        categories: ['utilities', 'security'],
        lang: 'ru-RU',

        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
})