<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import { useCarousel } from '@/composables/useCarousel'
import { contact, hero } from '@/content/site'

/** Tempo de cada foto no fundo do hero. */
const AUTOPLAY_MS = 7000

const { active, select } = useCarousel({
  count: hero.slides.length,
  autoplayMs: AUTOPLAY_MS,
})
</script>

<template>
  <section
    id="apresentacao"
    class="relative isolate flex min-h-screen items-center overflow-hidden bg-brand-900 pt-28 pb-24 sm:pt-32"
  >
    <!-- Fotos do escritório: decorativas, o texto do hero carrega o significado. -->
    <div class="absolute inset-0 -z-10" aria-hidden="true">
      <img
        v-for="(slide, index) in hero.slides"
        :key="slide.src"
        :src="slide.src"
        alt=""
        class="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out"
        :class="index === active ? 'opacity-100' : 'opacity-0'"
        :loading="index === 0 ? 'eager' : 'lazy'"
        :fetchpriority="index === 0 ? 'high' : undefined"
        draggable="false"
      />

      <div class="absolute inset-0 bg-brand-900/70" />
      <div class="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/80 to-transparent" />
    </div>

    <div class="relative mx-auto w-full max-w-6xl px-6">
      <div class="max-w-2xl" data-reveal>
        <p
          class="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-sand-200 uppercase"
        >
          <span class="h-px w-10 shrink-0 bg-sand-400" aria-hidden="true" />
          {{ hero.eyebrow }}
        </p>

        <h1 class="mt-6 text-4xl leading-[1.12] text-white sm:text-5xl lg:text-6xl">
          {{ hero.title }}
        </h1>

        <p class="mt-6 max-w-xl text-lg leading-relaxed text-brand-100/90">{{ hero.subtitle }}</p>

        <div class="mt-9 flex flex-wrap gap-4">
          <AppButton
            :href="contact.whatsappHref"
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="lg"
          >
            {{ hero.primaryCta }}
          </AppButton>
          <AppButton href="#areas" variant="outline-light" size="lg">
            {{ hero.secondaryCta }}
          </AppButton>
        </div>
      </div>
    </div>

    <div
      v-if="hero.slides.length > 1"
      class="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2.5"
      role="group"
      aria-label="Fotos do escritório"
    >
      <button
        v-for="(slide, index) in hero.slides"
        :key="slide.src"
        type="button"
        class="h-1.5 rounded-full transition-all duration-300"
        :class="
          index === active ? 'w-8 bg-sand-200' : 'w-1.5 bg-white/40 hover:bg-white/70'
        "
        :aria-current="index === active ? 'true' : undefined"
        :aria-label="`Exibir foto: ${slide.label}`"
        @click="select(index)"
      />
    </div>

    <a
      href="#areas"
      class="absolute right-6 bottom-10 hidden items-center gap-3 text-xs font-medium tracking-[0.18em] text-white/70 uppercase transition-colors hover:text-white lg:flex"
    >
      {{ hero.scrollLabel }}
      <span
        class="block h-10 w-px bg-white/40 motion-safe:animate-[hero-scroll_2.4s_ease-in-out_infinite]"
        aria-hidden="true"
      />
    </a>
  </section>
</template>
