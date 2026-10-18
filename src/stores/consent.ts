import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type ConsentValue = 'accepted' | 'rejected'

const STORAGE_KEY = 'adv.consent'

/** localStorage pode não existir (SSR) ou estar bloqueado (modo privado). */
function read(): ConsentValue | null {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY)
    return raw === 'accepted' || raw === 'rejected' ? raw : null
  } catch {
    return null
  }
}

function persist(value: ConsentValue) {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, value)
  } catch {
    // Sem persistência: a escolha vale só para esta sessão.
  }
}

/** Consentimento de cookies, persistido em localStorage (sem plugin de persistência). */
export const useConsentStore = defineStore('consent', () => {
  const value = ref<ConsentValue | null>(read())

  const decided = computed(() => value.value !== null)

  function accept() {
    value.value = 'accepted'
    persist('accepted')
  }

  function reject() {
    value.value = 'rejected'
    persist('rejected')
  }

  return { value, decided, accept, reject }
})
