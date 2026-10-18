<script setup lang="ts">
import { useConsentStore } from '@/stores/consent'

const consent = useConsentStore()
</script>

<template>
  <div
    v-if="!consent.decided"
    role="dialog"
    aria-live="polite"
    aria-label="Aviso de cookies"
    class="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur"
  >
    <div
      class="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="text-sm text-ink-700">
        Usamos os cookies necessários para lembrar suas preferências. Com a sua autorização,
        carregamos também o mapa do Google, que pode gravar cookies próprios. Você pode aceitar ou
        recusar — o conteúdo é o mesmo.
      </p>
      <div class="flex shrink-0 gap-3">
        <button
          type="button"
          class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          @click="consent.reject()"
        >
          Recusar
        </button>
        <button
          type="button"
          class="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          @click="consent.accept()"
        >
          Aceitar
        </button>
      </div>
    </div>
  </div>
</template>
