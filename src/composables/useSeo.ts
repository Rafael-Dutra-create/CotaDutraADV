import { onMounted } from 'vue'

import { site } from '@/content/site'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertJsonLd() {
  const id = 'adv-jsonld'
  if (document.getElementById(id)) return

  const script = document.createElement('script')
  script.id = id
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: site.name,
    description: site.description,
    telephone: site.contact.phoneDisplay,
    email: site.contact.email,
    openingHours: site.contact.hours,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.contact.address,
      addressLocality: site.contact.city,
      addressRegion: site.contact.state,
      postalCode: site.contact.zip,
      addressCountry: 'BR',
    },
  })
  document.head.appendChild(script)
}

/**
 * Título, descrição, idioma e dados estruturados da página.
 *
 * Como a landing é uma SPA de página única, não há roteador para cuidar disso:
 * os valores vêm de `src/content/site.ts`, e o `index.html` mantém o mesmo
 * conteúdo como fallback para o crawler.
 */
export function useSeo() {
  onMounted(() => {
    document.documentElement.lang = 'pt-BR'
    document.title = `${site.name} | ${site.tagline}`

    upsertMeta('name', 'description', site.description)
    upsertMeta('property', 'og:title', site.name)
    upsertMeta('property', 'og:description', site.description)
    upsertJsonLd()
  })
}
