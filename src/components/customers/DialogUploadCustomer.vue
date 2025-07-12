<template>
  <v-dialog v-model="localDialog" max-width="550px" persistent>
    <v-card class="elevation-16 rounded-xl shadow-lg">
      <!-- Header -->
      <v-card-title class="bg-gradient-to-r from-blue-darken-4 to-blue-darken-1 text-white text-h6 font-weight-bold d-flex align-center">
        <v-icon start class="mr-3">mdi-cloud-upload-outline</v-icon>
        Upload Customer Data
      </v-card-title>

      <!-- Body -->
      <v-card-text class="pt-8 px-6">
        <!-- File Input -->
        <v-file-input
          :model-value="props.csvFile"
          @update:model-value="handleFileUpdate"
          label="Select a CSV File"
          accept=".csv, text/csv"
          prepend-icon=""
          prepend-inner-icon="mdi-paperclip"
          variant="solo"
          density="comfortable"
          color="blue-darken-3"
          class="mb-4"
          clearable
        />

        <!-- Progress Bar -->
        <v-progress-linear
          v-if="uploading"
          indeterminate
          color="blue-darken-3"
          height="6"
          class="mb-2 rounded-pill"
        />
        
        <!-- Helper Text -->
        <v-alert
          v-else
          density="compact"
          type="info"
          variant="tonal"
          color="blue-darken-3"
          icon="mdi-information-outline"
          class="mt-2"
        >
          Please select a CSV file with customer data to upload.
        </v-alert>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="px-6 pb-5">
        <v-spacer />
        <v-btn
          variant="text"
          color="grey-darken-3"
          @click="$emit('close')"
          class="font-weight-bold"
        >
          <v-icon start class="mr-1">mdi-close-circle-outline</v-icon>
          Cancel
        </v-btn>
        <v-btn
          variant="elevated"
          color="blue-darken-3"
          class="text-white font-weight-bold"
          :loading="uploading"
          :disabled="!props.csvFile || uploading"
          @click="$emit('confirm')"
        >
          <v-icon start class="mr-1">mdi-upload-outline</v-icon>
          Upload Now
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed } from 'vue';

const props = defineProps<{
  dialog: boolean;
  csvFile: File | null;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'close'): void;
  (e: 'update:dialog', val: boolean): void;
  (e: 'update:csvFile', val: File | null): void;
}>();

const localDialog = ref(props.dialog);
const uploading = computed(() => props.loading);

// Sync local dialog state with parent
watch(() => props.dialog, (val) => {
  localDialog.value = val;
});

// Emit dialog updates to parent
watch(localDialog, (val) => {
  if (val !== props.dialog) {
    emit('update:dialog', val);
  }
});

// Handle file selection
const handleFileUpdate = (file: File | File[] | null) => {
  const selected = Array.isArray(file) ? file[0] : file;
  emit('update:csvFile', selected ?? null);
};
</script>

<style scoped>
.bg-gradient-to-r {
  background: linear-gradient(to right, var(--v-theme-from), var(--v-theme-to));
}
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}
</style>
