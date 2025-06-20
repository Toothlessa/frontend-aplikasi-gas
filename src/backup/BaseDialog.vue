<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="val => emit('update:modelValue', val)"
    :max-width="maxWidth"
    transition="dialog-bottom-transition"
  >
    <v-card class="elevation-12" variant="elevated">
      <v-card-title class="bg-grey-darken-2 text-white text-h6 d-flex align-center">
        <v-icon size="30">{{ icon }}</v-icon>
        <span class="ml-2">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <slot name="content" />
      </v-card-text>
      <v-card-actions>
        <slot name="actions" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: String,
  icon: String,
  maxWidth: {
    type: String,
    default: '500px'
  }
});
const emit = defineEmits(['update:modelValue']);
</script>
