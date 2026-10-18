import { onBeforeUnmount, onMounted, ref } from 'vue'

export interface CarouselOptions {
  /** Quantidade de itens do carrossel. */
  count: number
  /**
   * Intervalo do autoplay em milissegundos.
   * Omitido — ou com menos de dois itens — o carrossel é só manual.
   */
  autoplayMs?: number
}

/**
 * Comportamento compartilhado de carrossel: índice ativo, navegação e autoplay.
 *
 * Fica separado da marcação porque o hero (fundo full-bleed) e a seção Local
 * (moldura com setas) apresentam o mesmo comportamento de formas diferentes.
 * Duplicar a lógica do timer significaria dois lugares para consertar quando ela
 * quebrasse. O componente decide a aparência; este composable, o movimento.
 *
 * Quem pausa o autoplay (ponteiro sobre o carrossel, foco no teclado) chama
 * `pause()` e `resume()`. O pausado vive aqui dentro, e não no componente, porque
 * `select()` reinicia a contagem: sem esse estado, clicar numa seta com o ponteiro
 * em cima religaria o autoplay que o hover tinha acabado de parar.
 */
export function useCarousel({ count, autoplayMs }: CarouselOptions) {
  const active = ref(0)
  const paused = ref(false)

  let timer: ReturnType<typeof setInterval> | undefined

  function stop() {
    if (timer !== undefined) {
      clearInterval(timer)
      timer = undefined
    }
  }

  /** Sem autoplay quando não foi pedido, quando há um item só, ou com menos movimento. */
  function start() {
    stop()

    if (!autoplayMs || count < 2 || paused.value) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false) return

    timer = setInterval(() => select(active.value + 1), autoplayMs)
  }

  /**
   * Seleciona pelo índice, dando a volta nas pontas.
   * Reinicia a contagem: um clique do usuário conta como intenção de ficar ali.
   */
  function select(index: number) {
    if (count < 1) return

    active.value = ((index % count) + count) % count
    start()
  }

  const next = () => select(active.value + 1)
  const prev = () => select(active.value - 1)

  function pause() {
    paused.value = true
    stop()
  }

  /** Retoma e reinicia a contagem, para o item atual não sair antes da hora. */
  function resume() {
    paused.value = false
    start()
  }

  onMounted(start)
  onBeforeUnmount(stop)

  return { active, paused, select, next, prev, start, stop, pause, resume }
}
