import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

/**
 * /mnt/c é drvfs (9p) e não entrega eventos de inotify: o watcher do Vite fica
 * cego e o HMR nunca dispara. Nesses casos — e no container, onde o path é
 * /app — ligamos o polling. Em filesystem Linux nativo, fica no modo rápido.
 */
const usePolling = process.env.VITE_USE_POLLING === '1' || projectRoot.startsWith('/mnt/')

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Acesso pela LAN/hostname (ex.: http://rafaeldutra:8080) — vale só no dev server.
    // O Vite bloqueia Host desconhecido por padrão (proteção contra DNS rebinding).
    allowedHosts: ['rafaeldutra'],
    host: true,
    watch: usePolling ? { usePolling: true, interval: 300 } : undefined,
  },
})
