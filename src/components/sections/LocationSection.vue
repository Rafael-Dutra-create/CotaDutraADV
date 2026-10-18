<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import AppCarousel from '@/components/ui/AppCarousel.vue'
import SectionWrapper from '@/components/ui/SectionWrapper.vue'
import { contact, locationSection } from '@/content/site'
import { useConsentStore } from '@/stores/consent'

const consent = useConsentStore()
const labels = locationSection.labels
</script>

<template>
  <SectionWrapper
    id="local"
    :eyebrow="locationSection.eyebrow"
    :title="locationSection.title"
    :subtitle="locationSection.subtitle"
  >
    <div
      class="grid gap-10 rounded-2xl bg-white p-8 ring-1 ring-brand-100 sm:p-10 lg:grid-cols-2 lg:gap-14"
      data-reveal
    >
      <div>
        <p class="text-xs font-semibold tracking-[0.18em] text-brand-500 uppercase">
          {{ labels.address }}
        </p>
        <p class="mt-3 text-lg leading-relaxed text-brand-900">{{ contact.address }}</p>
        <p class="text-lg leading-relaxed text-brand-900">
          {{ contact.district }}, {{ contact.city }}/{{ contact.state }}
        </p>
        <p class="text-lg leading-relaxed text-brand-900">CEP {{ contact.zip }}</p>

        <p class="mt-8 text-xs font-semibold tracking-[0.18em] text-brand-500 uppercase">
          {{ labels.hours }}
        </p>
        <p class="mt-3 text-base text-ink-700">{{ contact.hours }}</p>

        <AppButton
          :href="contact.googleHref"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-8"
        >
          {{ locationSection.mapLabel }}
        </AppButton>

        <!--
          O mapa é a única requisição a terceiros do site. Ele só entra no DOM
          depois que o visitante aceita os cookies; para quem recusa, fica o
          aviso e o botão "Abrir no Google" acima, que não depende de nada.
        -->
        <div class="mt-8 overflow-hidden rounded-xl ring-1 ring-brand-100">
          <iframe
            v-if="consent.value === 'accepted'"
            :src="contact.mapEmbedHref"
            :title="locationSection.mapTitle"
            class="block h-72 w-full border-0"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
          <div
            v-else
            class="flex h-72 flex-col items-center justify-center gap-5 bg-brand-50 px-6 text-center"
          >
            <p class="max-w-xs text-sm leading-relaxed text-ink-700">
              {{ locationSection.mapConsentNotice }}
            </p>
            <AppButton id="map-consent" variant="secondary" @click="consent.accept()">
              {{ locationSection.mapConsentAction }}
            </AppButton>
          </div>
        </div>
      </div>

      <div>
        <AppCarousel
          :photos="locationSection.photos"
          :label="locationSection.carouselLabel"
          :prev-label="locationSection.prevLabel"
          :next-label="locationSection.nextLabel"
        />
      </div>
    </div>
  </SectionWrapper>
</template>
