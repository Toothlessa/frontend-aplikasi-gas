<template>
  <v-dialog v-model="localDialog" max-width="600px" persistent>
    <v-card class="dialog-card" rounded="xl">
      <!-- Header -->
      <v-card-title class="dialog-header">
        <v-icon size="26" class="mr-3">{{ isEdit ? 'mdi-account-edit-outline' : 'mdi-account-plus-outline' }}</v-icon>
        <span class="text-h6 font-weight-medium">
          {{ isEdit ? 'Edit Customer' : 'Add New Customer' }}
        </span>
      </v-card-title>

      <!-- Form Fields -->
      <v-card-text class="pa-6">
        <v-row dense>
          <v-col
            v-for="field in allFields"
            :key="field.model"
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="localItem[field.model]"
              :label="field.label"
              variant="outlined"
              density="comfortable"
              class="form-field"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="dialog-actions">
        <v-btn
          variant="text"
          class="cancel-btn"
          @click="$emit('close')"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="elevated"
          class="save-btn"
          :loading="props.loadingButtonCreate"
          @click="$emit('submit', localItem)"
        >
          {{ isEdit ? 'Save Changes' : 'Create Customer' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { Customer, CustomerField } from '@/types/Customer';

/* =========================================================
 * Props
 * Data yang diterima dari Parent (READ-ONLY)
 * ========================================================= */
const props = defineProps<{
  dialog: boolean;                 // kontrol buka/tutup dialog
  isEdit: boolean;                 // mode edit / create
  editedItem: Partial<Customer>;   // data customer yang diedit
  allFields: CustomerField[];      // konfigurasi field form
  loadingButtonCreate: boolean;    // kontrol loading button create
}>();

/* =========================================================
 * Emits
 * Event yang dikirim ke Parent
 * ========================================================= */
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', item: Partial<Customer>): void;
  (e: 'update:dialog', val: boolean): void;
}>();

/* =========================================================
 * Local State
 * State internal component (boleh dimodifikasi)
 * ========================================================= */
const localDialog = ref<boolean>(props.dialog);
const localItem = reactive<Partial<Customer>>({});

/* =========================================================
 * Watchers
 * ========================================================= */

/**
 * Sinkronisasi data edit dari Parent ke form lokal
 * - Trigger saat dialog dibuka
 * - Trigger saat editedItem berubah
 */
watch(
  () => [props.dialog, props.editedItem],
  ([dialog, editedItem]) => {
    if (dialog && editedItem) {
      Object.assign(localItem, editedItem);
    }
  },
  { immediate: true }
);

/**
 * Sinkronisasi dialog dari Parent → Child
 * Jika parent mengubah dialog, localDialog ikut berubah
 */
watch(
  () => props.dialog,
  (val) => {
    localDialog.value = val;
  }
);

/**
 * Sinkronisasi dialog dari Child → Parent
 * Mendukung v-model:dialog
 */
watch(
  localDialog,
  (val) => {
    emit('update:dialog', val);
  }
);
</script>


<style scoped>
.dialog-card {
  box-shadow: 0 10px 30px -5px rgba(0,0,0,0.2) !important;
  background: #f9f9f9;
}

.dialog-header {
  background: linear-gradient(to right, #1e88e5, #42a5f5);
  color: white;
  padding: 16px 24px;
  display: flex;
  align-items: center;
}

.form-field {
  margin-bottom: 12px;
}

.dialog-actions {
  padding: 16px 24px;
  background-color: #f1f1f1;
  border-top: 1px solid #e0e0e0;
  justify-content: flex-end;
}

.cancel-btn {
  color: #555;
  margin-right: 8px;
}

.save-btn {
  background-color: #1e88e5;
  color: white;
  font-weight: 500;
}
</style>