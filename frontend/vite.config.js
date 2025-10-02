import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import yaml from '@rollup/plugin-yaml'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
    }),
    yaml(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@content': fileURLToPath(new URL('./content', import.meta.url)),
    },
  },
  // Use '/' if deploying to custom domain or root of GitHub Pages
  // Use '/fablabsch/' if deploying to https://fablabs-ch.github.io/fablabsch/
  base: process.env.BASE_PATH || '/',
})
