<script setup lang="ts">
import ContactSection from '@/components/sections/ContactSection.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import LocationSection from '@/components/sections/LocationSection.vue'
import ServicesSection from '@/components/sections/ServicesSection.vue'
import TeamSection from '@/components/sections/TeamSection.vue'
import TheFooter from '@/components/sections/TheFooter.vue'
import TheHeader from '@/components/sections/TheHeader.vue'
import ConsentBanner from '@/components/ui/ConsentBanner.vue'
import { useReveal } from '@/composables/useReveal'
import { useSeo } from '@/composables/useSeo'
import { contact } from '@/content/site'

useSeo()
useReveal()
</script>

<template>
  <a
    href="#contato"
    class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
  >
    Ir para o contato
  </a>

  <TheHeader />

  <main>
    <HeroSection />
    <ServicesSection />
    <TeamSection />
    <LocationSection />
    <ContactSection />
  </main>

  <TheFooter />

  <a
    :href="contact.whatsappHref"
    target="_blank"
    rel="noopener noreferrer"
    class="fixed right-5 bottom-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-green-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-green-700"
    aria-label="Falar no WhatsApp"
  >
    <svg class="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.78 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.02Zm-7.01 15.24h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.38-1.73-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.02 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29Z"
      />
    </svg>
  </a>

  <ConsentBanner />
</template>
