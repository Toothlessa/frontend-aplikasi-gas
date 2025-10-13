<template>
  <div>
    <div class="d-flex justify-space-between align-center">
      <label class="github-label">{{ label }}</label>
      <slot name="forgot-password"></slot>
    </div>
    <v-text-field
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      density="compact"
      variant="outlined"
      :type="visible ? 'text' : 'password'"
      class="github-input mb-4"
      hide-details
    >
      <template #append-inner>
        <v-icon @click="visible = !visible" :icon="visible ? 'mdi-eye-off' : 'mdi-eye'"></v-icon>
      </template>
    </v-text-field>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: 'Password',
  },
});

defineEmits(['update:modelValue']);

const visible = ref(false);
</script>

<style scoped>
.github-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #24292e;
}

.github-input.v-text-field {
  background-color: #ffffff;
  border: 1px solid #d1d5da;
  border-radius: 6px;
  box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075);
}

.github-input.v-text-field:focus-within {
  border-color: #0366d6;
  box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075), 0 0 0 0.2em rgba(3, 102, 214, 0.3);
  outline: none;
}

.github-input.v-text-field .v-input__control {
  border-radius: 6px;
}

.github-input.v-text-field .v-field__input {
  padding: 8px 12px;
  min-height: unset;
}
</style>
