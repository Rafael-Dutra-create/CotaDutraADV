// Fontes self-hosted (sem requisição a terceiros: nada de Google Fonts em runtime).
import '@fontsource/lora/latin-400.css'
import '@fontsource/lora/latin-500.css'
import '@fontsource/lora/latin-600.css'
import '@fontsource/lora/latin-700.css'
import '@fontsource/titillium-web/latin-400.css'
import '@fontsource/titillium-web/latin-600.css'
import '@fontsource/titillium-web/latin-700.css'

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
