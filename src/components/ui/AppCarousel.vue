<script setup lang="ts">
import { useCarousel } from '@/composables/useCarousel'
import type { OfficePhoto } from '@/content/site'

const props = defineProps<{
  photos: OfficePhoto[]
  /** Rótulo acessível do grupo de indicadores. */
  label: string
  prevLabel: string
  nextLabel: string
}>()

/** Tempo de cada foto no carrossel. */
const AUTOPLAY_MS = 10_000

const { active, select, next, prev, pause, resume } = useCarousel({
  count: props.photos.length,
  autoplayMs: AUTOPLAY_MS,
})
</script>

<template>
  <div
    class="relative h-full overflow-hidden rounded-2xl bg-brand-900"
    @mouseenter="pause()"
    @mouseleave="resume()"
    @focusin="pause()"
    @focusout="resume()"
  >
    <!--
      Pausa no hover e no foco: ninguém quer a foto trocando embaixo do nariz.
      Este comentário fica DENTRO da div — um nó solto antes dela transformaria o
      template em Fragment, e aí `$el` deixa de ser a div raiz.
    -->
    <div class="relative aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[26rem]">
      <img
        v-for="(photo, index) in photos"
        :key="photo.src"
        :src="photo.src"
        :alt="index === active ? photo.label : ''"
        loading="lazy"
        class="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out"
        :class="index === active ? 'opacity-100' : 'opacity-0'"
      />
    </div>

    <button
      type="button"
      class="absolute top-1/2 left-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-brand-900/60 text-white transition-colors hover:bg-brand-900/85"
      :aria-label="prevLabel"
      @click="prev()"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 5l-7 7 7 7" />
      </svg>
    </button>

    <button
      type="button"
      class="absolute top-1/2 right-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-brand-900/60 text-white transition-colors hover:bg-brand-900/85"
      :aria-label="nextLabel"
      @click="next()"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <div
      class="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2.5"
      role="group"
      :aria-label="label"
    >
      <button
        v-for="(photo, index) in photos"
        :key="photo.src"
        type="button"
        class="h-1.5 rounded-full transition-all duration-300"
        :class="index === active ? 'w-6 bg-sand-200' : 'w-1.5 bg-white/50 hover:bg-white/80'"
        :aria-current="index === active ? 'true' : undefined"
        :aria-label="photo.label"
        @click="select(index)"
      />
    </div>
  </div>
</template>
