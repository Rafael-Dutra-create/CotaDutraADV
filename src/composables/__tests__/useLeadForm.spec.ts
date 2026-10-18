import { describe, expect, it } from 'vitest'

import { contact, services } from '@/content/site'
import { buildWhatsappUrl, whatsappUrlForText } from '../useLeadForm'

const lead = {
  name: 'Maria Silva',
  email: 'maria@exemplo.com',
  phone: '(21) 98470-0961',
  subject: 'Contrato de locação',
  message: 'Preciso de ajuda com um contrato.',
}

/** Extrai o texto pré-preenchido do deep link gerado. */
function messageOf(data: Parameters<typeof buildWhatsappUrl>[0]) {
  return new URL(buildWhatsappUrl(data)).searchParams.get('text') ?? ''
}

describe('buildWhatsappUrl', () => {
  it('aponta para o número de contato definido em site.ts', () => {
    const url = new URL(buildWhatsappUrl(lead))

    expect(url.origin).toBe('https://wa.me')
    expect(url.pathname).toBe(`/${contact.whatsappNumber}`)
  })

  it('usa um número só com dígitos, sem símbolos', () => {
    expect(contact.whatsappNumber).toMatch(/^\d{12,13}$/)
  })

  it('leva nome, e-mail e telefone na mensagem', () => {
    const text = messageOf(lead)

    expect(text).toContain('Maria Silva')
    expect(text).toContain('maria@exemplo.com')
    expect(text).toContain('(21) 98470-0961')
  })

  it('leva o assunto informado', () => {
    expect(messageOf(lead)).toContain('Assunto: Contrato de locação')
  })

  it('inclui o resumo da mensagem quando informada', () => {
    expect(messageOf(lead)).toContain('Mensagem: Preciso de ajuda com um contrato.')
  })

  it('omite as linhas opcionais quando assunto e mensagem estão vazios', () => {
    const text = messageOf({ ...lead, subject: '  ', message: '   ' })

    expect(text).not.toContain('Assunto:')
    expect(text).not.toContain('Mensagem:')
    expect(text).toContain('Maria Silva')
  })

  it('quebra as linhas do relatório no texto enviado', () => {
    expect(messageOf(lead)).toContain('\n')
  })
})

describe('whatsappUrlForText', () => {
  it('codifica o texto livre na query `text`', () => {
    const mensagem = 'Olá! Vim pelo site e preciso de ajuda com Direito Civil e Contratos.'

    expect(whatsappUrlForText(mensagem)).toBe(
      `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(mensagem)}`,
    )
  })

  it('resolve o template de assunto de cada área de atuação', () => {
    const area = services.items[0]!.title
    const mensagem = services.ctaMessageTemplate.replace('{area}', area)

    expect(mensagem).toContain(area)
    expect(mensagem).not.toContain('{area}')
  })
})
