import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Components({deep:true}),
  ],
  resolve:{
    alias:{
      '@':path.resolve(__dirname,"./src"),
      'assets':path.resolve(__dirname,"./src/assets"),
      'enemies':path.resolve(__dirname,"./src/components/enemies"),
      'spells':path.resolve(__dirname,"./src/components/spells"),
    }
  },
  build: {
    minify: false,
    rollupOptions: {
      treeshake: false
    }
  }
})
