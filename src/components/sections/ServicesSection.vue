<script setup lang="ts">
import AppCard from '@/components/ui/AppCard.vue'
import SectionWrapper from '@/components/ui/SectionWrapper.vue'
import { services } from '@/content/site'
import { whatsappUrlForText } from '@/composables/useLeadForm'

/**
 * Cada card leva ao WhatsApp com o assunto já preenchido.
 *
 * Não existe página por área (a landing é de uma página só), então o CTA aponta
 * para a conversa — que é onde o visitante decide falar ou não.
 */
function areaHref(area: string) {
  return whatsappUrlForText(services.ctaMessageTemplate.replace('{area}', area))
}
</script>

<template>
  <SectionWrapper
    id="areas"
    :eyebrow="services.eyebrow"
    :title="services.title"
    :subtitle="services.subtitle"
  >
    <div class="grid gap-6 lg:grid-cols-2">
      <AppCard v-for="service in services.items" :key="service.title" hoverable data-reveal>
        <h3 class="text-xl">{{ service.title }}</h3>
        <p class="mt-3 text-sm leading-relaxed text-ink-700">{{ service.description }}</p>

        <ul class="mt-5 space-y-2">
          <li
            v-for="bullet in service.bullets"
            :key="bullet"
            class="flex items-start gap-2 text-sm text-ink-700"
          >
            <svg
              class="mt-1 h-3.5 w-3.5 shrink-0 text-brand-500"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
                clip-rule="evenodd"
              />
            </svg>
            {{ bullet }}
          </li>
        </ul>

        <a
          :href="areaHref(service.title)"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-500"
        >
          {{ services.ctaLabel }}
          <span aria-hidden="true">&rarr;</span>
        </a>
      </AppCard>
    </div>
  </SectionWrapper>
</template>
