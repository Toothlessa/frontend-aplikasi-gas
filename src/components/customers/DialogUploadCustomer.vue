<template>
  <v-dialog v-model="localDialog" max-width="500px" persistent>
    <v-card class="elevation-12 rounded-xl ">
      <!-- Title -->
      <v-card-title class="bg-blue-accent-2 text-white text-h6 font-weight-bold">
        <v-icon start class="mr-2">mdi-cloud-upload</v-icon>
        Upload Customers
      </v-card-title>

      <!-- Body -->
      <v-card-text class="pt-6 px-4">
        <v-file-input
          :model-value="props.csvFile"
           @update:model-value="(file) => {
              const selected = Array.isArray(file) ? file[0] : file;
              emit('update:csvFile', selected ?? null);
            }"
          label="Select CSV File"
          accept=".csv"
          prepend-icon="mdi-file-upload-outline"
          variant="outlined"
          density="comfortable"
          color="blue-accent-2"
          class="mb-3"
        />

        <v-progress-linear
            v-if="uploading"
            indeterminate
            color="bg-blue-accent-2"
            class="mb-1"
        />
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn
            variant="text"
            color="grey-darken-2"
            @click="$emit('close')"
        >
          <v-icon start class="mr-1">mdi-close</v-icon>
          Cancel
        </v-btn>
        <v-btn
          variant="elevated"
          color="blue-accent-2"
          class="text-white"
          :loading="uploading"
          @click="$emit('confirm')"
        >
          <v-icon start class="mr-1">mdi-upload</v-icon>
          Upload
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps<{
  dialog: boolean;
  title?: string;
  message?: string;
  csvFile: File | null;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'close'): void;
  (e: 'update:dialog', val: boolean): void;
  (e: 'update:csvFile', val: File | null): void; // ✅ correct type
  (e: 'loading', val: boolean): void;
}>();

const localDialog = ref(props.dialog);
const uploading = ref(false);

// Watch parent prop and sync local dialog state
watch(() => props.dialog, (val) => {
  localDialog.value = val;
});

// Emit dialog update only (not csvFile here!)
watch(localDialog, (val) => {
  emit('update:dialog', val);
});
</script>