<template>
  <v-toolbar
    flat
    class="text-white rounded-lg px-4 py-2 shadow-strong"
    :color="color"
  >
    <!-- Title with Icon -->
    <div class="d-flex align-center">
      <v-icon size="28" class="mr-3">{{ icon }}</v-icon>
      <v-toolbar-title class="text-h6 font-weight-bold">
        {{ title }}
      </v-toolbar-title>
    </div>

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
      class="ma-0 search-field"
    />

    <!-- Action Buttons with Tooltips -->
    <v-tooltip text="Add New" location="top">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          variant="text"
          class="ml-3"
          @click="$emit('create')"
        >
          <v-icon>mdi-plus-circle-outline</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <v-tooltip v-if="showUploadButton" text="Upload Data" location="top">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          variant="text"
          @click="$emit('upload-customer')"
        >
          <v-icon>mdi-cloud-upload-outline</v-icon>
        </v-btn>
      </template>
    </v-tooltip>
  </v-toolbar>
</template>

<script setup lang="ts">
defineProps<{
  search: string;
  title: string;
  icon: string;
  color?: string; // color prop is no longer used for background
  showUploadButton?: boolean;
}>();

defineEmits(['update:search', 'create', 'upload-customer']);
</script>

<style scoped>
.shadow-strong {
  box-shadow: 0 8px 25px -5px rgba(0,0,0,0.2), 0 4px 15px -3px rgba(0,0,0,0.1) !important;
}

.search-field {
  background-color: rgba(255, 255, 255, 0.15) !important;
  border-radius: 8px;
}

.search-field .v-field__input,
.search-field .v-label {
  color: white !important;
}

.search-field .v-icon {
  color: rgba(255, 255, 255, 0.8) !important;
}

.v-btn--icon {
  transition: transform 0.2s ease-in-out;
}

.v-btn--icon:hover {
  transform: scale(1.1);
  background-color: rgba(255, 255, 255, 0.1);
}
</style>