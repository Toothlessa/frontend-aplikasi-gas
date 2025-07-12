<template>
  <v-snackbar
    v-model="model"
    :timeout="timeout"
    location="bottom right"
    color="red-darken-3"
    elevation="24"
    rounded="lg"
    multi-line
  >
    <div class="d-flex align-center">
      <v-icon size="22" class="mr-3">mdi-alert-circle-outline</v-icon>
      <div>
        <div class="font-weight-medium">Error Occurred</div>
        <ul class="text-caption mt-1 pl-1">
          <li v-for="(e, i) in messages" :key="i">{{ e }}</li>
        </ul>
      </div>
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
  messages: string[];
  timeout?: number;
}>();

const emit = defineEmits(['update:modelValue']);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>
