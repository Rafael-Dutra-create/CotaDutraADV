<script setup lang="ts">
import { computed } from 'vue'

import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import SectionWrapper from '@/components/ui/SectionWrapper.vue'
import { contact, contactSection } from '@/content/site'
import { useLeadForm } from '@/composables/useLeadForm'

const { store, submit } = useLeadForm()
const copy = contactSection.form

/** Só mostra o erro depois da primeira tentativa de envio. */
const fieldError = (field: 'name' | 'email' | 'phone') => (store.touched ? store.errors[field] : '')

const channels = computed(() => [
  {
    label: contactSection.channels.whatsappLabel,
    value: contact.whatsappDisplay,
    href: contact.whatsappHref,
  },
  {
    label: contactSection.channels.phoneLabel,
    value: contact.phoneDisplay,
    href: contact.phoneHref,
  },
  {
    label: contactSection.channels.emailLabel,
    value: contact.email,
    href: `mailto:${contact.email}`,
  },
])
</script>

<template>
  <SectionWrapper
    id="contato"
    :eyebrow="contactSection.eyebrow"
    :title="contactSection.title"
    :subtitle="contactSection.subtitle"
  >
    <div class="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
      <form
        class="space-y-5 rounded-2xl bg-white p-6 ring-1 ring-brand-100 sm:p-8"
        novalidate
        @submit.prevent="submit()"
      >
        <AppInput
          id="lead-name"
          v-model="store.form.name"
          :label="copy.nameLabel"
          :placeholder="copy.namePlaceholder"
          :error="fieldError('name')"
          autocomplete="name"
        />
        <div class="grid gap-5 sm:grid-cols-2">
          <AppInput
            id="lead-phone"
            v-model="store.form.phone"
            type="tel"
            :label="copy.phoneLabel"
            :placeholder="copy.phonePlaceholder"
            :error="fieldError('phone')"
            autocomplete="tel"
          />
          <AppInput
            id="lead-email"
            v-model="store.form.email"
            type="email"
            :label="copy.emailLabel"
            :placeholder="copy.emailPlaceholder"
            :error="fieldError('email')"
            autocomplete="email"
          />
        </div>
        <AppInput
          id="lead-subject"
          v-model="store.form.subject"
          :label="copy.subjectLabel"
          :placeholder="copy.subjectPlaceholder"
        />
        <AppInput
          id="lead-message"
          v-model="store.form.message"
          textarea
          :label="copy.messageLabel"
          :placeholder="copy.messagePlaceholder"
        />

        <AppButton
          type="submit"
          variant="whatsapp"
          size="lg"
          block
          :loading="store.status === 'loading'"
        >
          {{ store.status === 'loading' ? copy.submittingLabel : copy.submitLabel }}
        </AppButton>

        <p
          v-if="store.status === 'success'"
          role="status"
          class="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700"
        >
          {{ copy.successMessage }}
        </p>
        <p
          v-else-if="store.status === 'error'"
          role="alert"
          class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ store.error ?? copy.failureMessage }}
        </p>

        <p class="text-xs text-ink-500">{{ copy.privacyNote }}</p>
      </form>

      <div class="space-y-6 lg:pt-2" data-reveal>
        <dl class="space-y-5">
          <div v-for="channel in channels" :key="channel.label">
            <dt class="text-xs font-semibold tracking-[0.18em] text-brand-500 uppercase">
              {{ channel.label }}
            </dt>
            <dd class="mt-1.5">
              <a
                :href="channel.href"
                class="text-base font-medium text-brand-700 transition-colors hover:text-brand-500"
                :target="channel.href.startsWith('http') ? '_blank' : undefined"
                :rel="channel.href.startsWith('http') ? 'noopener noreferrer' : undefined"
              >
                {{ channel.value }}
              </a>
            </dd>
          </div>

          <div>
            <dt class="text-xs font-semibold tracking-[0.18em] text-brand-500 uppercase">
              {{ contactSection.channels.addressLabel }}
            </dt>
            <dd class="mt-1.5 text-base leading-relaxed text-ink-700">
              {{ contact.fullAddress }}
            </dd>
          </div>

          <div>
            <dt class="text-xs font-semibold tracking-[0.18em] text-brand-500 uppercase">
              {{ contactSection.channels.hoursLabel }}
            </dt>
            <dd class="mt-1.5 text-base text-ink-700">{{ contact.hours }}</dd>
          </div>
        </dl>

        <AppButton
          :href="contact.whatsappHref"
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          block
        >
          {{ contactSection.form.submitLabel }}
        </AppButton>
      </div>
    </div>
  </SectionWrapper>
</template>
