<script setup lang="ts">
import AppLogo from '@/components/ui/AppLogo.vue'
import { contact, footer, nav, services } from '@/content/site'
</script>

<template>
  <footer class="bg-brand-900 py-16 text-brand-100">
    <div class="mx-auto max-w-6xl px-6">
      <div class="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div class="sm:col-span-2 lg:col-span-1">
          <AppLogo tone="cream" />
          <p class="mt-5 max-w-sm text-sm leading-relaxed text-brand-100/75">{{ footer.about }}</p>
          <p class="mt-4 text-sm text-brand-100/60">{{ contact.oab }}</p>

          <ul v-if="footer.social.length" class="mt-6 flex gap-4">
            <li v-for="item in footer.social" :key="item.href">
              <a
                :href="item.href"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-brand-100/80 transition-colors hover:text-white"
              >
                {{ item.label }}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p class="text-xs font-semibold tracking-[0.18em] text-sand-200 uppercase">
            {{ footer.areasTitle }}
          </p>
          <ul class="mt-5 space-y-2.5">
            <li v-for="service in services.items" :key="service.title">
              <a
                href="#areas"
                class="text-sm text-brand-100/80 transition-colors hover:text-white"
              >
                {{ service.title }}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p class="text-xs font-semibold tracking-[0.18em] text-sand-200 uppercase">
            {{ footer.navigationTitle }}
          </p>
          <ul class="mt-5 space-y-2.5">
            <li v-for="link in nav" :key="link.href">
              <a :href="link.href" class="text-sm text-brand-100/80 transition-colors hover:text-white">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p class="text-xs font-semibold tracking-[0.18em] text-sand-200 uppercase">
            {{ footer.contactTitle }}
          </p>
          <ul class="mt-5 space-y-2.5 text-sm text-brand-100/80">
            <li>
              <a
                :href="contact.whatsappHref"
                target="_blank"
                rel="noopener noreferrer"
                class="transition-colors hover:text-white"
              >
                WhatsApp: {{ contact.whatsappDisplay }}
              </a>
            </li>
            <li>
              <a :href="contact.phoneHref" class="transition-colors hover:text-white">
                {{ contact.phoneDisplay }}
              </a>
            </li>
            <li>
              <a :href="`mailto:${contact.email}`" class="transition-colors hover:text-white">
                {{ contact.email }}
              </a>
            </li>
            <li>{{ contact.fullAddress }}</li>
            <li>{{ contact.hours }}</li>
          </ul>
        </div>
      </div>

      <div class="mt-14 border-t border-white/15 pt-6">
        <p class="text-xs leading-relaxed text-brand-100/60">{{ footer.disclaimer }}</p>
        <p class="mt-4 text-xs text-brand-100/60">{{ footer.copyright }}</p>
      </div>
    </div>
  </footer>
</template>
