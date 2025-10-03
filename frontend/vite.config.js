import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import yaml from '@rollup/plugin-yaml'
import { fileURLToPath, URL } from 'node:url'

// Plugin to optimize MDI fonts - only keep WOFF2
function optimizeMDIFonts() {
  return {
    name: 'optimize-mdi-fonts',
    enforce: 'post',
    generateBundle(options, bundle) {
      // Remove unwanted font files from the bundle
      for (const fileName in bundle) {
        if (fileName.includes('materialdesignicons-webfont')) {
          // Keep only WOFF2, remove EOT, WOFF, TTF
          if (fileName.endsWith('.eot') || 
              fileName.endsWith('.woff') || 
              fileName.endsWith('.ttf')) {
            delete bundle[fileName]
          }
        }
      }
    }
  }
}

export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
    }),
    yaml(),
    optimizeMDIFonts(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vue-vendor': ['vue', 'vue-router'],
          'vuetify-vendor': ['vuetify'],
          'map-vendor': ['leaflet'],
        },
      },
    },
    // Increase chunk size warning limit (optional, to reduce noise)
    chunkSizeWarningLimit: 600,
  },
  // Optimize CSS
  css: {
    devSourcemap: true,
  },
  // Use '/' if deploying to custom domain or root of GitHub Pages
  // Use '/fablabsch/' if deploying to https://fablabs-ch.github.io/fablabsch/
  base: process.env.BASE_PATH || '/',
})
