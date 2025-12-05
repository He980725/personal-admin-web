import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: '/',
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      // 导入时可省略的扩展名
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.vue', '.json'],
    },
    server: {
      host: '0.0.0.0',
      port: 8082,
      open: false,
      cors: true,
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: env.VITE_API_TARGET_URL,
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      minify: 'terser',
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          // 静态资源分类打包
          assetsInlineLimit: 10240,
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          // 拆分代码
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia'],
            elementPlus: ['element-plus'],
          },
        },
      },
    },
  }
})
