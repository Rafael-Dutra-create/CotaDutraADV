<script setup lang="ts" generic="T">
import { computed } from 'vue'

import { useCarousel } from '@/composables/useCarousel'

/**
 * Carrossel de conteúdo livre (texto, cartões), um item por vez.
 *
 * O conteúdo de cada slide vem por slot; aqui ficam só o movimento (índice
 * ativo, autoplay, pausa) e o chrome (indicadores e setas). O `AppCarousel`
 * cuida das fotos com o chrome sobreposto à imagem — são variantes visuais
 * diferentes, então convivem em vez de um virar caso particular do outro.
 *
 * A altura vem do conteúdo: os slides ficam empilhados na mesma célula do grid,
 * então a caixa mede o item mais alto e não pula a cada troca. Não há número
 * mágico para manter, e no celular funciona igual ao desktop.
 *
 * As setas ficam nas laterais, uma de cada lado, na metade da altura do card e
 * para fora da borda — mesma linguagem do `AppCarousel`. Os indicadores seguem
 * embaixo, centralizados: são eles que dizem em que ponto da lista se está.
 *
 * Quanto a seta avança para fora depende da tela, e o piso é o respiro de 24px
 * do container das seções: 20px até `xl`, e 48px daí para cima, onde o card já
 * está centralizado num container de 72rem e sobra margem até a borda.
 *
 * Quem precisa da caixa com a altura de um vizinho passa `h-full`/`lg:h-full`.
 */
const props = withDefaults(
  defineProps<{
    /** Itens exibidos, um por vez. */
    items: readonly T[]
    /** Rótulo acessível do indicador de um item. */
    itemLabel: (item: T, index: number) => string
    /** Rótulo acessível do grupo de indicadores. */
    label: string
    prevLabel: string
    nextLabel: string
    /** Intervalo do autoplay em milissegundos. */
    autoplayMs?: number
  }>(),
  { autoplayMs: 10_000 },
)

const { active, select, next, prev, pause, resume } = useCarousel({
  count: props.items.length,
  autoplayMs: props.autoplayMs,
})

/**
 * Item e índice juntos: no template, `items[index]` seria `T | undefined` por
 * causa do `noUncheckedIndexedAccess`, e o slot entrega o item já definido.
 */
const slides = computed(() => props.items.map((item, index) => ({ item, index })))
</script>

<template>
  <div
    class="relative flex flex-col"
    @mouseenter="pause()"
    @mouseleave="resume()"
    @focusin="pause()"
    @focusout="resume()"
  >
    <!--
      Empilhados na mesma célula do grid: a altura da caixa passa a ser a do
      maior slide. Este comentário fica DENTRO da div raiz de propósito — um nó
      solto antes dela transformaria o template em Fragment, e aí `$el` deixaria
      de ser esta div.
    -->
    <div class="grid">
      <div
        v-for="{ item, index } in slides"
        :key="index"
        class="col-start-1 row-start-1 transition-opacity duration-500 ease-out"
        :class="index === active ? 'opacity-100' : 'pointer-events-none opacity-0'"
        :aria-hidden="index === active ? undefined : 'true'"
      >
        <slot :item="item" :index="index" />
      </div>
    </div>

    <button
      type="button"
      class="absolute top-1/2 -left-5 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-brand-900/60 text-white transition-colors hover:bg-brand-900/85 xl:-left-12"
      :aria-label="prevLabel"
      @click="prev()"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 5l-7 7 7 7" />
      </svg>
    </button>

    <button
      type="button"
      class="absolute top-1/2 -right-5 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-brand-900/60 text-white transition-colors hover:bg-brand-900/85 xl:-right-12"
      :aria-label="nextLabel"
      @click="next()"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <div class="mt-auto flex justify-center pt-8" role="group" :aria-label="label">
      <button
        v-for="{ item, index } in slides"
        :key="index"
        type="button"
        class="h-1.5 rounded-full transition-all duration-300"
        :class="index === active ? 'w-6 bg-brand-700' : 'w-1.5 bg-brand-200 hover:bg-brand-500'"
        :aria-current="index === active ? 'true' : undefined"
        :aria-label="itemLabel(item, index)"
        @click="select(index)"
      />
    </div>
  </div>
</template>
