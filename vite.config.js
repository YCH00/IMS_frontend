import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import {PrimeVueResolver} from '@primevue/auto-import-resolver';

import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    watch: {
      usePolling: true,
    },
  },
  plugins: [
    vue(),
    AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router']
    }),
    Components({
      resolvers: [
        PrimeVueResolver(),
        ElementPlusResolver()
      ]
    })]
})
