<script setup lang="ts">
import { site } from '@/content/site'

withDefaults(
  defineProps<{
    /** `navy` para fundos claros, `cream` para fundos escuros. */
    tone?: 'navy' | 'cream'
  }>(),
  { tone: 'navy' },
)
</script>

<!--
  Marca em SVG inline (não `<img>`): o texto usa a fonte Lora, que carrega via
  @fontsource. Um SVG servido como imagem não carrega webfont e cairia na
  serifada do sistema.
-->
<template>
  <svg
    class="block h-9 w-auto"
    :class="tone === 'cream' ? 'text-sand-200' : 'text-brand-700'"
    viewBox="0 0 300 74"
    fill="none"
    aria-hidden="true"
  >
    <text
      class="logo-wordmark"
      x="150"
      y="33"
      text-anchor="middle"
      font-size="34"
      letter-spacing="-0.4"
      fill="currentColor"
    >
      {{ site.name }}
    </text>
    <line x1="106" y1="44" x2="194" y2="44" stroke="#cdbb96" stroke-width="1" />
    <text
      class="logo-sub"
      x="150"
      y="63"
      text-anchor="middle"
      font-size="9"
      letter-spacing="3.4"
      fill="currentColor"
    >
      ADVOGADOS ASSOCIADOS
    </text>
  </svg>
</template>

<style scoped>
/* `var()` não resolve em atributo de apresentação do SVG — só em declaração CSS. */
.logo-wordmark {
  font-family: var(--font-display);
  font-weight: 500;
}

.logo-sub {
  font-family: var(--font-sans);
  font-weight: 600;
}
</style>
