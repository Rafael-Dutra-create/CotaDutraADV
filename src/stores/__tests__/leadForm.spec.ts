import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useLeadFormStore, type LeadData } from '../leadForm'

const validLead: LeadData = {
  name: 'Maria Silva',
  email: 'maria@exemplo.com',
  phone: '(11) 91234-5678',
  subject: 'Contrato de locação',
  message: 'Preciso de ajuda com um contrato.',
}

/** Estado inicial do formulário — usado em mais de uma asserção. */
const emptyForm: LeadData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

describe('useLeadFormStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inicia vazio, com estado idle e sem ter sido tocado', () => {
    const store = useLeadFormStore()

    expect(store.form).toEqual(emptyForm)
    expect(store.status).toBe('idle')
    expect(store.touched).toBe(false)
    expect(store.error).toBeNull()
    expect(store.isValid).toBe(false)
  })

  it('aponta os campos inválidos', () => {
    const store = useLeadFormStore()

    store.form.name = 'M'
    store.form.email = 'sem-arroba'
    store.form.phone = '123'

    expect(store.errors.name).toBe('Informe seu nome.')
    expect(store.errors.email).toBe('Informe um e-mail válido.')
    expect(store.errors.phone).toBe('Informe um telefone válido.')
    expect(store.isValid).toBe(false)
  })

  it('não exige assunto nem mensagem para validar o lead', () => {
    const store = useLeadFormStore()

    Object.assign(store.form, { ...validLead, subject: '', message: '' })

    expect(store.isValid).toBe(true)
  })

  it('considera válido um lead completo', () => {
    const store = useLeadFormStore()

    Object.assign(store.form, validLead)

    expect(store.errors).toEqual({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    })
    expect(store.isValid).toBe(true)
  })

  it('não envia quando o formulário é inválido', async () => {
    const store = useLeadFormStore()
    const send = vi.fn<(data: LeadData) => Promise<void>>()

    await expect(store.submit(send)).resolves.toBe(false)

    expect(send).not.toHaveBeenCalled()
    expect(store.status).toBe('idle')
    expect(store.touched).toBe(true)
  })

  it('envia os dados quando válido e marca sucesso', async () => {
    const store = useLeadFormStore()
    Object.assign(store.form, validLead)
    const send = vi.fn<(data: LeadData) => Promise<void>>().mockResolvedValue(undefined)

    await expect(store.submit(send)).resolves.toBe(true)

    expect(send).toHaveBeenCalledWith(validLead)
    expect(store.status).toBe('success')
    expect(store.error).toBeNull()
  })

  it('guarda a mensagem de erro quando o envio falha', async () => {
    const store = useLeadFormStore()
    Object.assign(store.form, validLead)
    const send = vi
      .fn<(data: LeadData) => Promise<void>>()
      .mockRejectedValue(new Error('rede fora'))

    await expect(store.submit(send)).resolves.toBe(false)

    expect(store.status).toBe('error')
    expect(store.error).toBe('rede fora')
  })

  it('usa mensagem genérica quando o erro não é uma Error', async () => {
    const store = useLeadFormStore()
    Object.assign(store.form, validLead)
    const send = vi.fn<(data: LeadData) => Promise<void>>().mockRejectedValue('falhou')

    await store.submit(send)

    expect(store.error).toBe('Falha ao enviar. Tente novamente.')
  })

  it('reset volta ao estado inicial', async () => {
    const store = useLeadFormStore()
    Object.assign(store.form, validLead)
    await store.submit(vi.fn().mockResolvedValue(undefined))

    store.reset()

    expect(store.form).toEqual(emptyForm)
    expect(store.status).toBe('idle')
    expect(store.touched).toBe(false)
    expect(store.error).toBeNull()
  })
})
