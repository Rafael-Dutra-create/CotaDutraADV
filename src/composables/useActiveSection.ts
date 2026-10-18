import { onBeforeUnmount, onMounted, ref } from 'vue'

/** Fração da tela usada como linha de leitura: a seção que passou dela é a atual. */
const READING_LINE = 1 / 3

/**
 * Seção atualmente em leitura, entre as `ids` informadas.
 *
 * A regra é "a última seção que passou da linha de leitura": assim há uma
 * resposta única em qualquer posição da rolagem. O `IntersectionObserver` — que
 * seria o caminho natural, como no `useReveal` — empata quando duas seções
 * cruzam a faixa de observação ao mesmo tempo, e desempatar exigiria a mesma
 * linha de leitura.
 *
 * Seção sem altura não conta como atual. É também o que o jsdom devolve para
 * tudo, então em teste nada fica marcado sem um retângulo de mentira.
 */
export function useActiveSection(ids: readonly string[]) {
  const active = ref<string | null>(null)
  let frame = 0

  function update() {
    const line = window.innerHeight * READING_LINE
    let current: string | null = null

    for (const id of ids) {
      const element = document.getElementById(id)
      if (!element) continue

      const { top, height } = element.getBoundingClientRect()
      if (height > 0 && top <= line) current = id
    }

    active.value = current
  }

  /** Uma leitura de layout por frame, mesmo com o scroll disparando em rajada. */
  function schedule() {
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      update()
    })
  }

  onMounted(() => {
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
  })

  onBeforeUnmount(() => {
    if (frame) cancelAnimationFrame(frame)
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
  })

  return { active }
}
