<template>
  <v-snackbar
    v-model="model"
    :timeout="timeout"
    location="top center"
    elevation="10"
    color="green-darken-2"
    rounded="lg"
    class="text-white shadow-lg"
    multi-line
  >
   <div class="d-flex align-center">
      <span class="text-body-2 font-weight-medium">
        ✅ {{ message }}
      </span>
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
  message: string;
  timeout?: number;
}>();

const emit = defineEmits(['update:modelValue']);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>
