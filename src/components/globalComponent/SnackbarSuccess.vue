<template>
  <v-snackbar
    v-model="model"
    :timeout="timeout"
    location="bottom right"
    color="green-darken-2"
    elevation="24"
    rounded="lg"
  >
    <div class="d-flex align-center">
      <v-icon size="22" class="mr-3">mdi-check-circle-outline</v-icon>
      <div class="font-weight-medium">{{ message }}</div>
    </div>
    <template #actions>
      <v-btn icon variant="text" @click="model = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  message: string;
  timeout?: number;
}>();

const emit = defineEmits(['update:modelValue']);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>
