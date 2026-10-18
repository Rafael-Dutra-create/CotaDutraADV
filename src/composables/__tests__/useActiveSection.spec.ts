import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { useActiveSection } from '../useActiveSection'

const IDS = ['apresentacao', 'areas', 'equipe']

/** Linha de leitura do composable, no mesmo cálculo: um terço da tela. */
const LINE = window.innerHeight / 3

/** Altura das seções de mentira — altura zero o composable descarta. */
const HEIGHT = 100

/** Fora da tela, abaixo da linha de leitura. */
const ABAIXO = LINE + 200

/**
 * Monta o composable num componente mínimo: `onMounted`/`onBeforeUnmount` só
 * existem dentro de um setup, então o teste precisa de um hospedeiro.
 *
 * O `await nextTick` é do `onMounted`: a primeira leitura de layout acontece
 * depois do primeiro render, então o DOM só reflete o resultado no render
 * seguinte.
 */
async function mountSection() {
  const wrapper = mount(
    defineComponent({
      setup() {
        const { active } = useActiveSection(IDS)
        return () => h('span', { 'data-active': active.value ?? '' })
      },
    }),
  )

  await nextTick()

  return {
    wrapper,
    active: () => wrapper.get('[data-active]').attributes('data-active') || null,
  }
}

/** Cria as seções no documento, na ordem do menu. */
function createSections() {
  for (const id of IDS) {
    const section = document.createElement('section')
    section.id = id
    document.body.append(section)
  }
}

/** Diz onde a seção está na tela: `top` em relação à viewport, e a altura. */
function place(id: string, top: number, height = HEIGHT) {
  const section = document.getElementById(id)
  if (!section) throw new Error(`seção ${id} não existe`)

  section.getBoundingClientRect = () => ({ top, height }) as DOMRect
}

/** Espera o próximo frame, que é quando o composable relê o layout. */
function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
}

/** Rola e espera o composable reprocessar. */
async function scroll() {
  window.dispatchEvent(new Event('scroll'))
  await nextFrame()
}

describe('useActiveSection', () => {
  let section: Awaited<ReturnType<typeof mountSection>>

  beforeEach(() => {
    createSections()
  })

  afterEach(() => {
    section.wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('não marca nada quando todas as seções estão abaixo da linha', async () => {
    IDS.forEach((id) => place(id, ABAIXO))

    section = await mountSection()

    expect(section.active()).toBeNull()
  })

  it('marca a seção que passou da linha de leitura', async () => {
    place('apresentacao', -400)
    place('areas', LINE - 1)
    place('equipe', ABAIXO)

    section = await mountSection()

    expect(section.active()).toBe('areas')
  })

  it('acompanha a rolagem', async () => {
    IDS.forEach((id) => place(id, ABAIXO))
    section = await mountSection()

    place('apresentacao', -400)
    place('equipe', LINE - 1)
    await scroll()

    expect(section.active()).toBe('equipe')
  })

  it('marca a última seção ao chegar no fim da página', async () => {
    IDS.forEach((id) => place(id, -200))

    section = await mountSection()

    expect(section.active()).toBe('equipe')
  })

  it('ignora seção sem altura', async () => {
    place('apresentacao', -400)
    place('areas', LINE - 1, 0)

    section = await mountSection()

    expect(section.active()).toBe('apresentacao')
  })
})
