<template>
  <v-snackbar
    v-model="show"
    :timeout="timeout"
    location="top center"
    elevation="10"
    color="red-darken-3"
    rounded="lg"
    class="text-white shadow-lg"
    multi-line
  >
    <div class="d-flex flex-column">
      <v-icon size="24" class="mb-2 text-white">mdi-alert-circle</v-icon>
      <span class="font-weight-medium text-subtitle-2 mb-2">
        Please fix the following errors:
      </span>
      <ul class="pl-4 list-disc text-body-2">
        <li v-for="(e, i) in messages" :key="i">{{ e }}</li>
      </ul>
    </div>

    <template #actions>
      <v-btn icon variant="text" color="white" @click="show = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  messages: string[];
  timeout?: number;
}>();

const emit = defineEmits(['update:modelValue']);
const show = defineModel<boolean>({ default: false });
</script>
