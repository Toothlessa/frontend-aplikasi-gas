<template>
  <v-toolbar
    flat
    :class="[color || 'bg-cyan-darken-2', 'text-white', 'rounded-xl', 'px-4', 'py-3', 'elevation-3']"
  >
    <!-- Left-side Action Buttons -->
    <div class="d-flex align-center mr-4">
      <v-btn
        icon
        color="white"
        variant="text"
        class="mr-2"
        @click="$emit('create')"
      >
        <v-icon size="26">{{ icon }}</v-icon>
      </v-btn>

      <v-btn
        v-if="showUploadButton"
        icon
        color="white"
        variant="text"
        @click="$emit('upload-customer')"
      >
        <v-icon size="26">mdi-cloud-upload</v-icon>
      </v-btn>
    </div>

    <!-- Title -->
    <v-toolbar-title class="text-h6 font-weight-bold">
      {{ title }}
    </v-toolbar-title>

    <v-spacer />

    <!-- Search Field -->
    <v-text-field
      :model-value="search"
      @update:model-value="$emit('update:search', $event)"
      label="Search..."
      variant="solo-filled"
      density="comfortable"
      prepend-inner-icon="mdi-magnify"
      clearable
      hide-details
      class="ma-0"
      style="max-width: 350px"
    />
  </v-toolbar>
</template>

<script setup lang="ts">
defineProps<{
  search: string;
  title: string;
  icon: string;
  color?: string;
  showUploadButton?: boolean;
}>();

defineEmits(['update:search', 'create', 'upload-customer']);
</script>
