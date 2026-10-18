import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useCarousel } from '../useCarousel'

const ITEM_COUNT = 4

/**
 * Monta o composable num componente mínimo: `onMounted`/`onBeforeUnmount` só
 * existem dentro de um setup, então o teste precisa de um hospedeiro.
 */
function mountCarousel({ count = ITEM_COUNT, autoplayMs }: { count?: number; autoplayMs?: number } = {}) {
  const wrapper = mount(
    defineComponent({
      setup() {
        const { active, select, next, prev, pause, resume } = useCarousel({ count, autoplayMs })

        return () =>
          h('div', [
            h('span', { 'data-active': String(active.value) }),
            h('button', { 'data-next': '', onClick: next }),
            h('button', { 'data-prev': '', onClick: prev }),
            h('button', { 'data-select': '', onClick: () => select(2) }),
            h('button', { 'data-pause': '', onClick: pause }),
            h('button', { 'data-resume': '', onClick: resume }),
          ])
      },
    }),
  )

  return {
    wrapper,
    active: () => Number(wrapper.get('[data-active]').attributes('data-active')),
    click: async (selector: string) => {
      await wrapper.get(selector).trigger('click')
    },
  }
}

/** Substitui `window.matchMedia` para simular a preferência do sistema. */
function stubReducedMotion(matches: boolean) {
  vi.stubGlobal('matchMedia', () => ({ matches }))
}

describe('useCarousel', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('começa no primeiro item', () => {
    expect(mountCarousel().active()).toBe(0)
  })

  it('avança ao próximo item', async () => {
    const carousel = mountCarousel()

    await carousel.click('[data-next]')

    expect(carousel.active()).toBe(1)
  })

  it('volta para o último item ao recuar do primeiro', async () => {
    const carousel = mountCarousel()

    await carousel.click('[data-prev]')

    expect(carousel.active()).toBe(ITEM_COUNT - 1)
  })

  it('dá a volta ao avançar do último item', async () => {
    const carousel = mountCarousel()

    for (let i = 0; i < ITEM_COUNT; i += 1) {
      await carousel.click('[data-next]')
    }

    expect(carousel.active()).toBe(0)
  })

  it('seleciona um índice direto', async () => {
    const carousel = mountCarousel()

    await carousel.click('[data-select]')

    expect(carousel.active()).toBe(2)
  })

  it('ignora a seleção quando não há itens', async () => {
    const carousel = mountCarousel({ count: 0 })

    await carousel.click('[data-select]')

    expect(carousel.active()).toBe(0)
  })

  it('não inicia autoplay sem autoplayMs', async () => {
    vi.useFakeTimers()
    const carousel = mountCarousel()

    await vi.advanceTimersByTimeAsync(60_000)
    await nextTick()

    expect(carousel.active()).toBe(0)
  })

  it('avança sozinho quando há autoplayMs', async () => {
    vi.useFakeTimers()
    const carousel = mountCarousel({ autoplayMs: 5000 })

    await vi.advanceTimersByTimeAsync(5000)
    await nextTick()

    expect(carousel.active()).toBe(1)
  })

  it('para de avançar quando o componente é desmontado', async () => {
    vi.useFakeTimers()
    const carousel = mountCarousel({ autoplayMs: 5000 })

    await vi.advanceTimersByTimeAsync(5000)
    await nextTick()
    carousel.wrapper.unmount()

    await vi.advanceTimersByTimeAsync(30_000)

    expect(carousel.active()).toBe(1)
  })

  it('não faz autoplay com um item só', async () => {
    vi.useFakeTimers()
    const carousel = mountCarousel({ count: 1, autoplayMs: 5000 })

    await vi.advanceTimersByTimeAsync(30_000)
    await nextTick()

    expect(carousel.active()).toBe(0)
  })

  it('não faz autoplay quando o sistema pede menos movimento', async () => {
    vi.useFakeTimers()
    stubReducedMotion(true)

    const carousel = mountCarousel({ autoplayMs: 5000 })

    await vi.advanceTimersByTimeAsync(30_000)
    await nextTick()

    expect(carousel.active()).toBe(0)
  })

  it('pausa o autoplay e não volta sozinho', async () => {
    vi.useFakeTimers()
    const carousel = mountCarousel({ autoplayMs: 5000 })

    await vi.advanceTimersByTimeAsync(5000)
    await nextTick()
    await carousel.click('[data-pause]')

    await vi.advanceTimersByTimeAsync(30_000)
    await nextTick()

    expect(carousel.active()).toBe(1)
  })

  it('retoma o autoplay depois da pausa, reiniciando a contagem', async () => {
    vi.useFakeTimers()
    const carousel = mountCarousel({ autoplayMs: 5000 })

    await carousel.click('[data-pause]')
    await vi.advanceTimersByTimeAsync(30_000)
    await carousel.click('[data-resume]')

    await vi.advanceTimersByTimeAsync(5000)
    await nextTick()

    expect(carousel.active()).toBe(1)
  })

  it('não religa o autoplay quando o item muda durante a pausa', async () => {
    vi.useFakeTimers()
    const carousel = mountCarousel({ autoplayMs: 5000 })

    // Este é o caso do ponteiro: pausado pelo hover, o usuário clica na seta.
    // `select()` reinicia a contagem, e sem o estado `paused` religaria o timer.
    await carousel.click('[data-pause]')
    await carousel.click('[data-next]')

    await vi.advanceTimersByTimeAsync(30_000)
    await nextTick()

    expect(carousel.active()).toBe(1)
  })
})
