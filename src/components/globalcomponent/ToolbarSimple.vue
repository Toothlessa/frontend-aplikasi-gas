<template>
  <v-toolbar flat class="bg-cyan-darken-2 text-white rounded-xl px-4 py-2">
    <v-btn
      icon
      variant="flat"
      color="white"
      size="large"
      class="mr-2"
      @click="$emit('create')"
    >
      <v-icon size="28"> {{ icon }}</v-icon>
    </v-btn>

    <v-toolbar-title class="text-h6 font-weight-regular">
      {{ title }}
    </v-toolbar-title>

    <v-spacer />

    <v-text-field
      :model-value="search"
      @update:model-value="$emit('update:search', $event)"
      label="Search items"
      variant="solo-filled"
      density="comfortable"
      prepend-inner-icon="mdi-magnify"
      clearable
      class="ma-0"
      style="max-width: 400px;"
    />
  </v-toolbar>
</template>

<script setup lang="ts">
defineProps<{
  search: string;
  title: string;
  icon: string;
}>();

defineEmits(['update:search', 'create']);
</script>
