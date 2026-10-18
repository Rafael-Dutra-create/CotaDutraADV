<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Âncora usada pela navegação do header. */
    id?: string
    eyebrow?: string
    title?: string
    subtitle?: string
    align?: 'left' | 'center'
  }>(),
  { align: 'left' },
)

/**
 * Fundo único de todas as seções: o mesmo branco acinzentado do começo da
 * página. Hero e rodapé têm fundo próprio (navy) e não passam por aqui.
 */
const sectionClasses = 'pt-[10px] pb-[130px] bg-brand-50'

const headerClasses = computed(() => [
  'max-w-2xl',
  props.align === 'center' ? 'mx-auto text-center' : '',
])

const eyebrowClasses = computed(() => [
  'flex items-center gap-3 text-xs font-semibold tracking-[0.18em] text-brand-500 uppercase',
  props.align === 'center' ? 'justify-center' : '',
])
</script>

<template>
  <section :id="id" :class="sectionClasses">
    <div class="mx-auto max-w-6xl px-6">
      <div v-if="eyebrow || title || subtitle" :class="headerClasses" data-reveal>
        <p v-if="eyebrow" :class="eyebrowClasses">
          <span class="h-px w-8 shrink-0 bg-brand-500" aria-hidden="true" />
          {{ eyebrow }}
        </p>
        <h2 v-if="title" class="mt-5 text-3xl sm:text-4xl">{{ title }}</h2>
        <p v-if="subtitle" class="mt-5 text-base leading-relaxed text-ink-700 sm:text-lg">
          {{ subtitle }}
        </p>
      </div>

      <div class="mt-12">
        <slot />
      </div>
    </div>
  </section>
</template>
