<template>
  <v-snackbar
    v-model="model"
    :timeout="timeout"
    location="top center"
    elevation="10"
    color="red-darken-3"
    rounded="lg"
    class="text-white shadow-lg"
    multi-line
  >

    <div class="d-flex align-start">
      <v-icon size="24" class="me-2 text-white">mdi-alert-circle</v-icon>
      <div>
        <span class="font-weight-medium text-subtitle-2">
          Please fix the following errors:
        </span>
        <ul class="pl-4 list-disc text-body-2 mt-1">
          <li v-for="(e, i) in messages" :key="i">{{ e }}</li>
        </ul>
      </div>
    </div>

    <template #actions>
      <v-btn icon variant="text" color="white" @click="model = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  messages: string[];
  timeout?: number;
}>();

const emit = defineEmits(['update:modelValue']);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>
