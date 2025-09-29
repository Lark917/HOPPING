import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  base: './',
  // 移除了PostCSS在Vite配置中的直接配置，因为我们已经在postcss.config.js中配置
  build: {
    // 确保构建输出与本地开发环境尽可能一致
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // 禁用一些可能导致不一致的优化
    sourcemap: false,
  },
  // 开发服务器配置，确保本地测试与生产环境一致
  server: {
    port: 5173,
    host: true,
    open: true,
  },
})
