import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AppButton from '../AppButton.vue'

describe('AppButton', () => {
  it('renderiza um button por padrão com o texto do slot', () => {
    const wrapper = mount(AppButton, { slots: { default: 'Enviar' } })

    const button = wrapper.get('button')
    expect(button.text()).toBe('Enviar')
    expect(button.attributes('type')).toBe('button')
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('renderiza um link quando recebe href', () => {
    const wrapper = mount(AppButton, {
      props: { href: 'https://exemplo.com/contato', target: '_blank', rel: 'noopener' },
      slots: { default: 'WhatsApp' },
    })

    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.get('a').attributes('href')).toBe('https://exemplo.com/contato')
    expect(wrapper.get('a').attributes('target')).toBe('_blank')
    expect(wrapper.get('a').attributes('rel')).toBe('noopener')
  })

  it('emite click ao ser acionado', async () => {
    const wrapper = mount(AppButton, { slots: { default: 'Enviar' } })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('não emite click quando desabilitado', async () => {
    const wrapper = mount(AppButton, { props: { disabled: true }, slots: { default: 'Enviar' } })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('em loading expõe aria-busy e ignora cliques', async () => {
    const wrapper = mount(AppButton, { props: { loading: true }, slots: { default: 'Enviar' } })

    const button = wrapper.get('button')
    expect(button.attributes('aria-busy')).toBe('true')
    expect(button.attributes('disabled')).toBeDefined()

    await button.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('block ocupa a largura toda', () => {
    const wrapper = mount(AppButton, { props: { block: true }, slots: { default: 'Enviar' } })

    expect(wrapper.get('button').classes()).toContain('w-full')
  })
})
