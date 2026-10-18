<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'ghost' | 'whatsapp' | 'outline-light'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    /** Quando presente, o botão é renderizado como link. */
    href?: string
    target?: string
    rel?: string
    variant?: Variant
    size?: Size
    type?: 'button' | 'submit'
    /** Ocupa a largura do container. */
    block?: boolean
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    block: false,
    loading: false,
    disabled: false,
  },
)

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-900',
  secondary: 'bg-white text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50',
  ghost: 'text-brand-700 hover:bg-brand-50',
  // Verde do WhatsApp, um tom abaixo: o #25d366 puro berra na página e o texto
  // branco fica com contraste baixo. Escurecer melhora os dois.
  whatsapp: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
  // Contorno claro: para botões sobre fundo escuro (hero, rodapé).
  'outline-light': 'bg-transparent text-white ring-1 ring-white/40 hover:bg-white/10 hover:ring-white/70',
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

const tag = computed(() => (props.href ? 'a' : 'button'))
const isDisabled = computed(() => props.disabled || props.loading)

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
  props.block ? 'w-full' : 'w-auto',
  isDisabled.value ? 'opacity-60 pointer-events-none' : '',
  VARIANT_CLASSES[props.variant],
  SIZE_CLASSES[props.size],
])

function onClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<template>
  <component
    :is="tag"
    :href="href"
    :target="target"
    :rel="rel"
    :type="tag === 'button' ? type : undefined"
    :disabled="tag === 'button' ? isDisabled : undefined"
    :aria-busy="loading || undefined"
    :class="classes"
    @click="onClick"
  >
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
    </svg>
    <slot />
  </component>
</template>
