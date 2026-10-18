import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import TeamSection from '../TeamSection.vue'
import AppTextCarousel from '@/components/ui/AppTextCarousel.vue'
import { team } from '@/content/site'

/** Precisa bater com o `autoplayMs` padrão do AppTextCarousel. */
const AUTOPLAY_MS = 10_000

function render() {
  return mount(TeamSection)
}

/**
 * A ficha visível é a única fora de um nó com `aria-hidden`.
 * Filtrar `aria-hidden` solto pegaria também os `<svg>` das setas, por isso a
 * busca parte da foto ou do título.
 */
function visiblePhoto(wrapper: ReturnType<typeof render>) {
  const photo = wrapper
    .findAll('#equipe img')
    .find((image) => !image.element.closest('[aria-hidden="true"]'))

  return photo?.attributes('src')
}

function visibleName(wrapper: ReturnType<typeof render>) {
  const heading = wrapper
    .findAll('#equipe h3')
    .find((title) => !title.element.closest('[aria-hidden="true"]'))

  return heading?.text()
}

/** Fichas escondidas: as fotos que estão dentro de um nó `aria-hidden`. */
function hiddenPhotos(wrapper: ReturnType<typeof render>) {
  return wrapper
    .findAll('#equipe img')
    .filter((image) => image.element.closest('[aria-hidden="true"]'))
}

describe('TeamSection', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('traz uma ficha com foto para cada advogado, e a abertura da banca', () => {
    const wrapper = render()

    expect(wrapper.findAll('#equipe h3')).toHaveLength(team.slides.length)
    expect(wrapper.findAll('#equipe img')).toHaveLength(team.slides.length)
  })

  it('mostra uma ficha por vez, começando pela foto do grupo', () => {
    const wrapper = render()

    expect(hiddenPhotos(wrapper)).toHaveLength(team.slides.length - 1)
    expect(visibleName(wrapper)).toBe(team.slides[0]!.name)
    expect(visiblePhoto(wrapper)).toBe(team.slides[0]!.photo.src)
  })

  it('troca a foto junto com a ficha de 10 em 10 segundos', async () => {
    vi.useFakeTimers()
    const wrapper = render()

    await vi.advanceTimersByTimeAsync(AUTOPLAY_MS)
    await nextTick()

    expect(visibleName(wrapper)).toBe(team.slides[1]!.name)
    expect(visiblePhoto(wrapper)).toBe(team.slides[1]!.photo.src)
  })

  it('troca a foto junto com a ficha ao usar as setas', async () => {
    const wrapper = render()

    await wrapper.get('button[aria-label="Próximo card"]').trigger('click')

    expect(visibleName(wrapper)).toBe(team.slides[1]!.name)
    expect(visiblePhoto(wrapper)).toBe(team.slides[1]!.photo.src)

    await wrapper.get('button[aria-label="Card anterior"]').trigger('click')

    expect(visiblePhoto(wrapper)).toBe(team.slides[0]!.photo.src)
  })

  it('pausa enquanto o ponteiro está sobre as fichas', async () => {
    vi.useFakeTimers()
    const wrapper = render()

    // `mouseenter` não borbulha: o evento precisa ir no root do carrossel, onde
    // mora o handler, e não no `<section>` que o envolve.
    await wrapper.findComponent(AppTextCarousel).trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(AUTOPLAY_MS * 3)
    await nextTick()

    expect(visibleName(wrapper)).toBe(team.slides[0]!.name)
    expect(visiblePhoto(wrapper)).toBe(team.slides[0]!.photo.src)
  })

  it('mostra a foto inteira, sem corte', () => {
    const fotos = render().findAll('#equipe img')

    expect(fotos).toHaveLength(team.slides.length)
    expect(fotos.every((foto) => foto.classes().includes('object-contain'))).toBe(true)
    expect(fotos.every((foto) => foto.classes().includes('aspect-square'))).toBe(true)
  })
})
