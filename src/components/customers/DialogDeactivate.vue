<template>
  <v-dialog v-model="localDialog" max-width="460px" persistent>
    <v-card class="rounded-xl elevation-12">
        <v-card-title class="bg-blue-accent-2 text-white d-flex align-center py-4">
            <v-icon class="mr-2" size="24">mdi-alert-circle-outline</v-icon>
            <span class="text-h6 font-weight-medium">{{ title }}</span>
        </v-card-title>

      <v-card-text class="text-center text-body-2 pt-2">
        {{ message }}
      </v-card-text>

      <v-card-actions class="justify-center py-4">
        <v-btn
          color="grey-darken-2"
          variant="text"
          class="text-white px-4"
          @click="$emit('cancel')"
        >
          <v-icon class="mr-1">mdi-cancel</v-icon>
          Cancel
        </v-btn>

        <v-btn
          color="red-darken-2"
          variant="elevated"
          class="text-white px-4"
          @click="$emit('confirm')"
          :loading="loading"
        >
          <v-icon class="mr-1">mdi-check-decagram</v-icon>
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
/* -----------------------------------------------------*
 * IMPORTS                                              *
 * ---------------------------------------------------- */
import { ref, watch } from 'vue';

/* -----------------------------------------------------*
 * PROPS                                                *
 * Data yang diterima dari Parent (READ-ONLY)           *
 * ---------------------------------------------------- */
const props = defineProps<{
  dialog: boolean;   // kontrol buka / tutup dialog
  title?: string;   // judul dialog (optional)
  message?: string; // pesan dialog (optional)
  loading: boolean; // kontrol loading dialog (optional)
}>();

/* -----------------------------------------------------*
 * EMITS                                                *
 * Event yang dikirim ke Parent                          *
 * ---------------------------------------------------- */
const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
  (e: 'update:dialog', val: boolean): void;
}>();

/* -----------------------------------------------------*
 * LOCAL STATE                                          *
 * State internal component                              *
 * ---------------------------------------------------- */
const localDialog = ref<boolean>(props.dialog);

/* -----------------------------------------------------*
 * WATCHERS                                             *
 * Sinkronisasi state Parent ↔ Child                     *
 * ---------------------------------------------------- */

/**
 * Parent → Child
 * Jika parent mengubah dialog, localDialog ikut berubah
 */
watch(
  () => props.dialog,
  (val) => {
    localDialog.value = val;
  }
);

/**
 * Child → Parent
 * Emit update untuk mendukung v-model:dialog
 */
watch(
  localDialog,
  (val) => {
    emit('update:dialog', val);
  }
);
</script>