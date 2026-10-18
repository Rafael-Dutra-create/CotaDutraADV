import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

export interface LeadData {
  name: string
  email: string
  phone: string
  /** Campo "Assunto" do formulário. Opcional — não bloqueia o envio. */
  subject: string
  message: string
}

export type LeadStatus = 'idle' | 'loading' | 'success' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validação e estado de envio do formulário de lead.
 *
 * O envio em si é injetado em `submit(send)`: uma função `(data) => Promise<void>`.
 * Composables de primeira classe cumprem aqui o papel do padrão **Strategy** — trocar
 * o destino (WhatsApp, endpoint, Formspree) é passar outra função, sem editar a store.
 */
export const useLeadFormStore = defineStore('leadForm', () => {
  const form = reactive<LeadData>({ name: '', email: '', phone: '', subject: '', message: '' })
  const status = ref<LeadStatus>('idle')
  const touched = ref(false)
  const error = ref<string | null>(null)

  const errors = computed(() => ({
    name: form.name.trim().length >= 2 ? '' : 'Informe seu nome.',
    email: EMAIL_RE.test(form.email) ? '' : 'Informe um e-mail válido.',
    phone: form.phone.replace(/\D/g, '').length >= 10 ? '' : 'Informe um telefone válido.',
    subject: '',
    message: '',
  }))

  const isValid = computed(() => Object.values(errors.value).every((e) => !e))

  function reset() {
    Object.assign(form, { name: '', email: '', phone: '', subject: '', message: '' })
    status.value = 'idle'
    touched.value = false
    error.value = null
  }

  async function submit(send: (data: LeadData) => Promise<void>) {
    touched.value = true
    if (!isValid.value) return false
    status.value = 'loading'
    error.value = null
    try {
      await send({ ...form })
      status.value = 'success'
      return true
    } catch (e) {
      status.value = 'error'
      error.value = e instanceof Error ? e.message : 'Falha ao enviar. Tente novamente.'
      return false
    }
  }

  return { form, status, touched, error, errors, isValid, reset, submit }
})
