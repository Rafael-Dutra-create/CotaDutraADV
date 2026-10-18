import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import TheHeader from '../TheHeader.vue'
import { nav } from '@/content/site'

/**
 * O estado vive aqui porque `vi.mock` é içado acima dos imports — a fábrica não
 * pode ler um `const` declarado depois dela. `vi.hoisted` sobe junto.
 */
const state = vi.hoisted(() => ({ active: 'equipe' }))

vi.mock('@/composables/useActiveSection', async () => {
  const { ref } = await import('vue')

  return { useActiveSection: () => ({ active: ref<string | null>(state.active) }) }
})

function render() {
  return mount(TheHeader, {
    global: { plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })] },
  })
}

/** Links do menu desktop, na ordem do `nav`. */
function links(wrapper: ReturnType<typeof render>) {
  return wrapper.findAll('nav[aria-label="Navegação principal"] a')
}

describe('TheHeader', () => {
  beforeEach(() => {
    state.active = 'equipe'
  })

  it('marca no menu a seção em leitura', () => {
    const menu = links(render())

    expect(menu.map((link) => link.attributes('aria-current'))).toEqual([
      undefined,
      undefined,
      'true',
      undefined,
      undefined,
    ])
    expect(menu[2]?.text()).toBe(nav[2]?.label)
  })

  it('dá peso maior ao link da seção em leitura, e só a ele', () => {
    const menu = links(render())
    const [ativo, ...outros] = menu.slice(2)

    expect(ativo?.classes()).toContain('font-semibold')
    expect(outros.every((link) => link.classes().includes('font-medium'))).toBe(true)
    expect(menu[0]?.classes()).toContain('font-medium')
  })

  it('sublinha o link da seção em leitura, e só a ele', () => {
    const menu = links(render())

    expect(menu.map((link) => link.find('span').exists())).toEqual([
      false,
      false,
      true,
      false,
      false,
    ])
  })

  it('marca a seção em leitura também no menu mobile', async () => {
    state.active = 'local'
    const wrapper = render()

    await wrapper.get('button[aria-label="Abrir menu de navegação"]').trigger('click')

    const mobile = wrapper.findAll('nav[aria-label="Navegação mobile"] a')

    expect(mobile.map((link) => link.attributes('aria-current'))).toEqual([
      undefined,
      undefined,
      undefined,
      'true',
      undefined,
    ])
    expect(mobile[3]?.classes()).toContain('font-semibold')
  })
})
