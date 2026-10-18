<script setup lang="ts">
import { computed, useId } from 'vue'

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    label: string
    /** Base do `id`/`for`. Sem ele, um id único é gerado. */
    id?: string
    type?: string
    placeholder?: string
    /** Mensagem de erro; quando presente, marca o campo como inválido. */
    error?: string
    /** Renderiza um `<textarea>` em vez de `<input>`. */
    textarea?: boolean
    rows?: number
    autocomplete?: string
    required?: boolean
  }>(),
  { type: 'text', rows: 4, required: false },
)

const generatedId = `field-${useId()}`
const fieldId = computed(() => props.id ?? generatedId)
const errorId = computed(() => `${fieldId.value}-error`)

const fieldClasses = computed(() => [
  'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-brand-900 placeholder:text-ink-500',
  'focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors',
  props.error
    ? 'border-red-400 focus:ring-red-300'
    : 'border-brand-200 focus:border-brand-500 focus:ring-brand-200',
])
</script>

<template>
  <div class="space-y-1.5">
    <label :for="fieldId" class="block text-sm font-medium text-ink-700">{{ label }}</label>

    <textarea
      v-if="textarea"
      :id="fieldId"
      v-model="model"
      :rows="rows"
      :placeholder="placeholder"
      :required="required"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="error ? errorId : undefined"
      :class="fieldClasses"
    />
    <input
      v-else
      :id="fieldId"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="error ? errorId : undefined"
      :class="fieldClasses"
    />

    <p v-if="error" :id="errorId" class="text-sm text-red-600">{{ error }}</p>
  </div>
</template>
