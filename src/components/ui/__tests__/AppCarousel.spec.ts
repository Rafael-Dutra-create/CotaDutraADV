import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import AppCarousel from '../AppCarousel.vue'
import { officePhotos } from '@/content/site'

/** Precisa bater com o AUTOPLAY_MS do componente. */
const AUTOPLAY_MS = 10_000

const props = {
  photos: officePhotos,
  label: 'Fotos do escritório',
  prevLabel: 'Foto anterior',
  nextLabel: 'Próxima foto',
}

function render() {
  return mount(AppCarousel, { props })
}

/** Índice da foto marcada como visível (`opacity-100`). */
function visibleIndex(wrapper: ReturnType<typeof render>) {
  return wrapper.findAll('img').findIndex((img) => img.classes().includes('opacity-100'))
}

describe('AppCarousel', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renderiza uma imagem por foto', () => {
    expect(render().findAll('img')).toHaveLength(officePhotos.length)
  })

  it('começa mostrando a primeira foto', () => {
    expect(visibleIndex(render())).toBe(0)
  })

  it('mostra a foto anterior ao clicar na seta da esquerda, dando a volta', async () => {
    const wrapper = render()

    await wrapper.get(`button[aria-label="${props.prevLabel}"]`).trigger('click')

    expect(visibleIndex(wrapper)).toBe(officePhotos.length - 1)
  })

  it('avança ao clicar na seta da direita', async () => {
    const wrapper = render()

    await wrapper.get(`button[aria-label="${props.nextLabel}"]`).trigger('click')

    expect(visibleIndex(wrapper)).toBe(1)
  })

  it('marca o indicador da foto ativa e permite escolher outra', async () => {
    const wrapper = render()
    const indicators = () => wrapper.findAll(`[role="group"] button`)

    expect(indicators()[0]?.attributes('aria-current')).toBe('true')

    await indicators()[2]!.trigger('click')

    expect(visibleIndex(wrapper)).toBe(2)
    expect(indicators()[2]?.attributes('aria-current')).toBe('true')
  })

  it('dá texto alternativo apenas para a foto visível', async () => {
    const wrapper = render()

    expect(wrapper.findAll('img').map((img) => img.attributes('alt'))).toEqual([
      officePhotos[0]!.label,
      '',
      '',
      '',
    ])

    await wrapper.get(`button[aria-label="${props.nextLabel}"]`).trigger('click')

    expect(wrapper.findAll('img').map((img) => img.attributes('alt'))).toEqual([
      '',
      officePhotos[1]!.label,
      '',
      '',
    ])
  })
})

describe('AppCarousel — autoplay', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('troca de foto de 10 em 10 segundos', async () => {
    vi.useFakeTimers()
    const wrapper = render()

    await vi.advanceTimersByTimeAsync(AUTOPLAY_MS)
    await nextTick()

    expect(visibleIndex(wrapper)).toBe(1)
  })

  it('pausa enquanto o ponteiro está sobre o carrossel', async () => {
    vi.useFakeTimers()
    const wrapper = render()

    await wrapper.trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(AUTOPLAY_MS * 3)
    await nextTick()

    expect(visibleIndex(wrapper)).toBe(0)

    await wrapper.trigger('mouseleave')
    await vi.advanceTimersByTimeAsync(AUTOPLAY_MS)
    await nextTick()

    expect(visibleIndex(wrapper)).toBe(1)
  })

  it('não religa o autoplay ao clicar na seta com o ponteiro em cima', async () => {
    vi.useFakeTimers()
    const wrapper = render()

    await wrapper.trigger('mouseenter')
    await wrapper.get(`button[aria-label="${props.nextLabel}"]`).trigger('click')
    await vi.advanceTimersByTimeAsync(AUTOPLAY_MS * 3)
    await nextTick()

    expect(visibleIndex(wrapper)).toBe(1)
  })

  it('pausa enquanto o foco do teclado está no carrossel', async () => {
    vi.useFakeTimers()
    const wrapper = render()

    await wrapper.trigger('focusin')
    await vi.advanceTimersByTimeAsync(AUTOPLAY_MS * 3)
    await nextTick()

    expect(visibleIndex(wrapper)).toBe(0)
  })
})
