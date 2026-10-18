import { onBeforeUnmount, onMounted } from 'vue'

/**
 * Revela os elementos marcados com `data-reveal` conforme entram na viewport.
 *
 * A animação em si vive no CSS (`src/assets/main.css`); aqui só trocamos o
 * atributo para `"visible"`. Sem `IntersectionObserver` — jsdom nos testes ou
 * navegadores antigos — tudo é exibido de imediato, então o conteúdo nunca
 * depende de JS para aparecer.
 */
export function useReveal() {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

    if (typeof IntersectionObserver === 'undefined') {
      elements.forEach((el) => el.setAttribute('data-reveal', 'visible'))
      return
    }

    const onIntersect: IntersectionObserverCallback = (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.setAttribute('data-reveal', 'visible')
        obs.unobserve(entry.target)
      }
    }

    observer = new IntersectionObserver(onIntersect, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1,
    })

    elements.forEach((el) => observer?.observe(el))
  })

  onBeforeUnmount(() => observer?.disconnect())
}
