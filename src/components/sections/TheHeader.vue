<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import AppButton from '@/components/ui/AppButton.vue'
import AppLogo from '@/components/ui/AppLogo.vue'
import { useActiveSection } from '@/composables/useActiveSection'
import { contact, header, nav, site, type NavLink } from '@/content/site'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
const scrolled = ref(false)

/** O href do menu é a âncora (`#equipe`); o composable trabalha com o id puro. */
const sectionId = (link: NavLink) => link.href.slice(1)

const { active: activeId } = useActiveSection(nav.map(sectionId))
const isActive = (link: NavLink) => activeId.value === sectionId(link)

/**
 * Cor e peso do link: o da seção atual fica mais forte que os outros, que
 * seguem o estado do header (claro sobre o hero, escuro depois de rolar).
 *
 * O peso entra junto com a cor porque cor sozinha não distingue quem não a vê.
 */
function linkClasses(link: NavLink) {
  if (isActive(link)) {
    return scrolled.value ? 'font-semibold text-brand-700' : 'font-semibold text-white'
  }

  return scrolled.value
    ? 'font-medium text-ink-700 hover:text-brand-600'
    : 'font-medium text-white/85 hover:text-white'
}

/** No menu mobile o fundo é sempre claro, então o destaque não depende do scroll. */
function mobileLinkClasses(link: NavLink) {
  return isActive(link) ? 'font-semibold text-brand-700' : 'font-medium text-ink-700'
}

function onScroll() {
  scrolled.value = window.scrollY > 8
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-40 border-b transition-colors"
    :class="
      scrolled
        ? 'border-brand-100 bg-paper/95 backdrop-blur'
        : 'border-transparent bg-transparent'
    "
  >
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
      <!--
        Sobre o hero escuro o header fica transparente com texto claro; ao rolar
        vira sólido com a paleta da marca.
      -->
      <a
        href="#apresentacao"
        class="flex items-center gap-2"
        :aria-label="header.logoLabel"
        @click="ui.closeMobileMenu()"
      >
        <AppLogo :tone="scrolled ? 'navy' : 'cream'" />
        <span class="sr-only">{{ site.fullName }}</span>
      </a>

      <nav class="hidden items-center gap-8 lg:flex" aria-label="Navegação principal">
        <a
          v-for="link in nav"
          :key="link.href"
          :href="link.href"
          class="relative text-sm transition-colors"
          :class="linkClasses(link)"
          :aria-current="isActive(link) ? 'true' : undefined"
        >
          {{ link.label }}
          <span
            v-if="isActive(link)"
            class="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full"
            :class="scrolled ? 'bg-brand-500' : 'bg-sand-200'"
            aria-hidden="true"
          />
        </a>
      </nav>

      <div class="hidden lg:block">
        <AppButton
          :href="contact.whatsappHref"
          target="_blank"
          rel="noopener noreferrer"
          :variant="scrolled ? 'whatsapp' : 'outline-light'"
          size="sm"
        >
          {{ header.ctaLabel }}
        </AppButton>
      </div>

      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors lg:hidden"
        :class="scrolled ? 'text-brand-900 hover:bg-brand-50' : 'text-white hover:bg-white/10'"
        :aria-expanded="ui.mobileMenuOpen"
        :aria-label="header.menuLabel"
        @click="ui.toggleMobileMenu()"
      >
        <svg
          v-if="!ui.mobileMenuOpen"
          class="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        <svg
          v-else
          class="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>

    <div v-if="ui.mobileMenuOpen" class="border-t border-brand-100 bg-paper lg:hidden">
      <nav class="mx-auto flex max-w-6xl flex-col px-6 py-2" aria-label="Navegação mobile">
        <a
          v-for="link in nav"
          :key="link.href"
          :href="link.href"
          class="border-b border-brand-100 py-3 text-sm last:border-0"
          :class="mobileLinkClasses(link)"
          :aria-current="isActive(link) ? 'true' : undefined"
          @click="ui.closeMobileMenu()"
        >
          {{ link.label }}
        </a>
      </nav>
      <div class="px-6 pb-4">
        <AppButton
          :href="contact.whatsappHref"
          target="_blank"
          rel="noopener noreferrer"
          variant="whatsapp"
          block
          @click="ui.closeMobileMenu()"
        >
          {{ header.ctaLabel }}
        </AppButton>
      </div>
    </div>
  </header>
</template>
