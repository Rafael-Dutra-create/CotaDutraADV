import { defineStore } from 'pinia'
import { ref } from 'vue'

/** Estado de UI compartilhado entre header, menu mobile e banner de consentimento. */
export const useUiStore = defineStore('ui', () => {
  const mobileMenuOpen = ref(false)

  const toggleMobileMenu = () => (mobileMenuOpen.value = !mobileMenuOpen.value)
  const closeMobileMenu = () => (mobileMenuOpen.value = false)

  return { mobileMenuOpen, toggleMobileMenu, closeMobileMenu }
})
