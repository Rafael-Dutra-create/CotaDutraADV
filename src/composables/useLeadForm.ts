import { site } from '@/content/site'
import { useLeadFormStore, type LeadData } from '@/stores/leadForm'

/**
 * Monta um link `wa.me` com o texto informado.
 *
 * Ponto único de montagem de deep links do WhatsApp: quem precisa de uma
 * mensagem pré-preenchida (formulário de contato, CTA de cada área de atuação)
 * passa por aqui, em vez de repetir a URL.
 */
export function whatsappUrlForText(text: string) {
  return `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(text)}`
}

/**
 * Monta o deep link do WhatsApp com a mensagem do formulário já preenchida.
 *
 * TODO-ADV: se o destino passar a ser um backend/Formspree, trocar apenas a
 * função passada para `store.submit()` — a store não muda.
 */
export function buildWhatsappUrl(data: LeadData) {
  const lines = [
    'Olá! Vim pelo site.',
    `Nome: ${data.name}`,
    `E-mail: ${data.email}`,
    `Telefone: ${data.phone}`,
  ]

  const subject = data.subject.trim()
  if (subject) lines.push(`Assunto: ${subject}`)

  const message = data.message.trim()
  if (message) lines.push(`Mensagem: ${message}`)

  return whatsappUrlForText(lines.join('\n'))
}

/**
 * Liga o formulário de contato à store de lead.
 *
 * `send` é a estratégia de envio atual (WhatsApp). Mantê-la como função solta
 * permite trocar o destino sem tocar na validação nem no componente.
 */
export function useLeadForm() {
  const store = useLeadFormStore()

  async function send(data: LeadData) {
    const url = buildWhatsappUrl(data)
    const opened = window.open(url, '_blank', 'noopener,noreferrer')
    if (!opened) {
      throw new Error('Não foi possível abrir o WhatsApp. Verifique o bloqueador de pop-ups.')
    }
  }

  /** Submete o formulário usando a estratégia de envio padrão. */
  const submit = () => store.submit(send)

  return { store, submit }
}
