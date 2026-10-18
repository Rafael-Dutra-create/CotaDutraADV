import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import App from '@/App.vue'
import { contact, hero, locationSection, nav, officePhotos, services, site, team } from '@/content/site'

function renderApp() {
  return mount(App, {
    global: { plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })] },
  })
}

describe('App', () => {
  // A escolha de cookies é persistida em localStorage: sem limpar, um teste
  // que aceita contamina o próximo (o banner já nasce dispensado).
  beforeEach(() => {
    localStorage.clear()
  })
  it('renderiza todas as âncoras de navegação', () => {
    const wrapper = renderApp()

    for (const link of nav) {
      expect(wrapper.find(link.href).exists(), `âncora ${link.href}`).toBe(true)
    }
  })

  it('mostra o nome do escritório no header e no rodapé', () => {
    const wrapper = renderApp()

    expect(wrapper.get('header').text()).toContain(site.fullName)
    expect(wrapper.get('footer').text()).toContain(site.fullName)
  })

  it('não renderiza mais as seções de processo, depoimentos e FAQ', () => {
    const wrapper = renderApp()

    expect(wrapper.find('#processo').exists()).toBe(false)
    expect(wrapper.find('#depoimentos').exists()).toBe(false)
    expect(wrapper.find('#faq').exists()).toBe(false)
  })

  it('exibe uma foto do escritório por indicador no hero', () => {
    const wrapper = renderApp()

    const dots = wrapper.findAll('#apresentacao [role="group"] button')

    expect(dots).toHaveLength(hero.slides.length)
    expect(dots[0]?.attributes('aria-current')).toBe('true')
    expect(wrapper.find('#apresentacao').text()).toContain(hero.title)
  })

  it('leva cada área de atuação ao WhatsApp com o assunto preenchido', () => {
    const wrapper = renderApp()

    const links = wrapper.findAll('#areas a[href^="https://wa.me/"]')

    expect(links).toHaveLength(services.items.length)

    const href = links[0]?.attributes('href') ?? ''
    expect(decodeURIComponent(href)).toContain(services.items[0]!.title)
  })

  it('apresenta a equipe da banca, uma ficha por vez', () => {
    const wrapper = renderApp()
    const secao = wrapper.get('#equipe').text()

    // As fichas vivem no carrossel ao mesmo tempo; só uma é exibida por vez.
    expect(wrapper.findAll('#equipe h3')).toHaveLength(team.slides.length)
    expect(wrapper.findAll('#equipe img')).toHaveLength(team.slides.length)

    for (const slide of team.slides) {
      expect(secao).toContain(slide.name)
      expect(secao).toContain(slide.bio)
    }
  })

  it('mostra o endereço completo e o carrossel de fotos na seção Local', () => {
    const wrapper = renderApp()
    const local = wrapper.get('#local').text()

    expect(local).toContain(contact.address)
    expect(local).toContain(contact.zip)
    expect(wrapper.findAll('#local img')).toHaveLength(officePhotos.length)
  })

  it('leva à ficha do escritório no Google, não ao endereço', () => {
    const wrapper = renderApp()
    const botao = wrapper.get('#local a[href^="https://www.google.com/search?"]')

    expect(botao.attributes('href')).toBe(contact.googleHref)
    expect(botao.text()).toBe(locationSection.mapLabel)

    // O `kgmid` é o que identifica o cadastro: sem ele o Google geocodifica o
    // texto e para no logradouro, sem chegar à sala.
    expect(botao.attributes('href')).toContain('kgmid=/g/11p210x9dq')
  })

  it('não embute o mapa do Google antes do consentimento', () => {
    const wrapper = renderApp()

    expect(wrapper.find('#local iframe').exists()).toBe(false)
    expect(wrapper.get('#local').text()).toContain(locationSection.mapConsentNotice)
  })

  it('carrega o mapa do Google depois de aceitar os cookies', async () => {
    const wrapper = renderApp()

    await wrapper.get('#map-consent').trigger('click')

    expect(wrapper.get('#local iframe').attributes('src')).toBe(contact.mapEmbedHref)
  })

  it('expõe o botão flutuante de WhatsApp', () => {
    const wrapper = renderApp()

    const fab = wrapper.get('a[aria-label="Falar no WhatsApp"]')
    expect(fab.attributes('href')).toBe(site.contact.whatsappHref)
  })

  it('renderiza o formulário de contato com os campos esperados', () => {
    const wrapper = renderApp()

    expect(wrapper.find('#lead-name').exists()).toBe(true)
    expect(wrapper.find('#lead-email').exists()).toBe(true)
    expect(wrapper.find('#lead-phone').exists()).toBe(true)
    expect(wrapper.find('#lead-subject').exists()).toBe(true)
    expect(wrapper.find('#lead-message').exists()).toBe(true)
  })

  it('mostra o banner de consentimento até haver uma escolha', async () => {
    const wrapper = renderApp()

    const banner = wrapper.get('[aria-label="Aviso de cookies"]')
    expect(banner.text()).toContain('Recusar')

    await wrapper.get('[aria-label="Aviso de cookies"] button:last-child').trigger('click')

    expect(wrapper.find('[aria-label="Aviso de cookies"]').exists()).toBe(false)
  })
})
