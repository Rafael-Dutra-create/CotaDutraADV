<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Adiciona elevação/borda de destaque ao passar o mouse. */
    hoverable?: boolean
  }>(),
  { hoverable: false },
)
</script>

<template>
  <div
    class="rounded-2xl bg-white p-6 ring-1 ring-brand-100"
    :class="hoverable ? 'transition-shadow hover:shadow-soft hover:ring-brand-200' : ''"
  >
    <slot />
  </div>
</template>
