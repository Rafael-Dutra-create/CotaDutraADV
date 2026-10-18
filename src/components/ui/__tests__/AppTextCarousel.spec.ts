import { DOMWrapper, mount } from '@vue/test-utils'
import { nextTick, h } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import AppTextCarousel from '../AppTextCarousel.vue'

/** Precisa bater com o `autoplayMs` padrão do componente. */
const AUTOPLAY_MS = 10_000

interface Slide {
  label: string
}

const items: Slide[] = [{ label: 'Um' }, { label: 'Dois' }, { label: 'Três' }]

function render() {
  return mount(AppTextCarousel<Slide>, {
    props: {
      items,
      itemLabel: (item: Slide) => item.label,
      label: 'Escolher item',
      prevLabel: 'Item anterior',
      nextLabel: 'Próximo item',
    },
    slots: {
      default: (params: { item: Slide }) => h('p', { class: 'slide' }, params.item.label),
    },
  })
}

/** Containers dos slides, na ordem do DOM. Não dá para filtrar por `aria-hidden` solto: os `<svg>` das setas também o têm. */
function slideContainers(wrapper: ReturnType<typeof render>) {
  return wrapper.findAll('.slide').map((slide) => new DOMWrapper(slide.element.parentElement!))
}

/** Índice do slide visível: os inativos levam `aria-hidden`. */
function visibleIndex(wrapper: ReturnType<typeof render>) {
  return slideContainers(wrapper).findIndex((slide) => slide.attributes('aria-hidden') !== 'true')
}

describe('AppTextCarousel', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renderiza um slide por item', () => {
    expect(render().findAll('.slide')).toHaveLength(items.length)
  })

  it('começa mostrando o primeiro item', () => {
    expect(visibleIndex(render())).toBe(0)
  })

  it('esconde os slides inativos, que não recebem foco nem clique', () => {
    const inativos = slideContainers(render()).filter(
      (slide) => slide.attributes('aria-hidden') === 'true',
    )

    expect(inativos).toHaveLength(items.length - 1)
    expect(inativos.every((slide) => slide.classes().includes('pointer-events-none'))).toBe(true)
  })

  it('volta ao último item ao clicar na seta da esquerda, dando a volta', async () => {
    const wrapper = render()

    await wrapper.get('button[aria-label="Item anterior"]').trigger('click')

    expect(visibleIndex(wrapper)).toBe(items.length - 1)
  })

  it('avança ao clicar na seta da direita', async () => {
    const wrapper = render()

    await wrapper.get('button[aria-label="Próximo item"]').trigger('click')

    expect(visibleIndex(wrapper)).toBe(1)
  })

  it('marca o indicador do item ativo e permite escolher outro', async () => {
    const wrapper = render()
    const indicadores = () => wrapper.findAll('[role="group"] button')

    expect(indicadores()[0]?.attributes('aria-current')).toBe('true')

    await indicadores()[2]!.trigger('click')

    expect(visibleIndex(wrapper)).toBe(2)
    expect(indicadores()[2]?.attributes('aria-current')).toBe('true')
  })
})

describe('AppTextCarousel — autoplay', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('troca de item de 10 em 10 segundos', async () => {
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
    await wrapper.get('button[aria-label="Próximo item"]').trigger('click')
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
