import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'logo.png', 'logo-icon.png'],
      manifest: {
        name: '都市型サバイバー　家庭防災スコアカード',
        short_name: '家庭防災スコア',
        description: '家庭の防災準備状況を診断し、防災力を数値化・可視化するWebアプリ',
        theme_color: '#1A202C',
        background_color: '#1A202C',
        display: 'standalone',
        icons: [
          {
            // logo.png（透過背景）はiOS/Androidのホーム画面アイコンでは背景が白く合成されて見えるため、
            // 黒背景を焼き込んだlogo-icon.pngを使う。SNSシェア時のOG画像は引き続きlogo.png（透過）のまま。
            src: 'logo-icon.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'logo-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
})
