<template>
  <v-dialog v-model="localDialog" max-width="600px" persistent>
    <v-card class="dialog-card" rounded="xl">
      <!-- Header -->
      <v-card-title class="dialog-header">
        <v-icon size="26" class="mr-3">{{ 'mdi-account-plus-outline' }}</v-icon>
        <span class="text-h6 font-weight-medium">
             Add New Owner
        </span>
      </v-card-title>

      <!-- Form Fields -->
      <v-card-text class="pa-6">
        <v-text-field
          v-model="localOwner.name"
          label="Owner Name"
          variant="outlined"
          density="comfortable"
          class="form-field"
          rounded="lg"
        />
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="dialog-actions">
        <v-btn
          variant="text"
          class="cancel-btn"
          @click="handleClose"
          rounded="pill"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="elevated"
          class="save-btn"
          @click="handleSave"
          rounded="pill"
        >
          Save        
        </v-btn>
      </v-card-actions>

      <!-- Search Bar -->
      <v-toolbar flat class="bg-grey-lighten-4 pa-2" density="comfortable">
        <v-text-field
          :model-value="search"
          @update:model-value="$emit('update:search', $event)"
          label="Search Owners"
          variant="solo-filled"
          density="comfortable"
          prepend-inner-icon="mdi-magnify"
          clearable
          class="flex-grow-1"
          rounded="lg"
          hide-details
        />
      </v-toolbar>

      <!-- Table -->
      <v-data-table-virtual
        :headers="headers"
        :items="filteredItems"
        class="modern-table"
        :filter-keys="['name']"
        :loading="loading"
        loading-text="Loading owners..."
        density="comfortable"
        item-value="id"
        hover
      >
        <template v-slot:[`item.active_flag`]="{ item }">
          <v-chip
            :color="item.active_flag ? 'teal' : 'red-lighten-1'"
            class="text-white font-weight-bold"
            size="small"
            label
            rounded="md"
          >
            {{ item.active_flag ? 'Active' : 'Inactive' }}
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            icon="mdi-pencil-outline"
            size="small"
            variant="text"
            class="mr-1 text-primary"
            @click="$emit('updateOwner', item)"
          />
          <v-btn
            icon="mdi-radioactive"
            size="small"
            variant="text"
            class="text-red-lighten-1"
            @click="openDeactivateDialog(item)"
          />
        </template>
      </v-data-table-virtual>
    </v-card>
  </v-dialog>
  <DialogDeactivate
    :dialog="dialogDeactivate"
    title="Confirm Deactivation"
    message="Are you sure you want to deactivate this owner?"
    @confirm="onDeactivateConfirm"
    @cancel="dialogDeactivate = false"
  />
</template>

<script setup lang="ts">
import { watch, computed } from 'vue';
import type { Owner, HeaderOwner } from '@/types/Asset';
import DialogDeactivate from '@/components/globalComponent/DialogDeactivate.vue';
import { useOwner } from '@/composables/useOwner';

const props = defineProps<{
  dialog: boolean;
  newOwner: Partial<Owner>;
  search: string;
  owners: Owner[];
  headers: HeaderOwner[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', item: Partial<Owner>): void;
  (e: 'updateOwner', item: Owner): void;
  (e: 'deactivate', item: Owner): void;
  (e: 'update:search', search: string): void;
}>();

const {
  localDialog,
  dialogDeactivate,

  localOwner,
  defaultOwner,

  handleClose,
  handleSave,

  openDeactivateDialog,
  onDeactivateConfirm,
        
} = useOwner(props, emit);

// Sync localDialog with parent
watch(() => props.dialog, (val) => {
  localDialog.value = val;
});

// When newCategory changes and dialog is open, fill localCategory
watch(
  () => [props.dialog, props.newOwner],
  ([dialog, newVal]) => {
    if (dialog) {
      // Clear localOwner to ensure a fresh start
      Object.assign(localOwner, defaultOwner); // Reset to default
      if (newVal) {
        Object.assign(localOwner, newVal); // Assign new values if available
      }
    }
  },
  { immediate: true }
);

  // Filtered category list
const filteredItems = computed(() => {
  if (!props.search) return props.owners;

  const keyword = props.search.toLowerCase();
  return props.owners.filter(item =>
    item.name?.toLowerCase().includes(keyword)
  );
});

</script>

<style scoped>
.dialog-card {
  box-shadow: 0 10px 30px -5px rgba(0,0,0,0.2) !important;
  background: #FFFFFF;
}

.dialog-header {
  background: linear-gradient(45deg, #009688 0%, #4DB6AC 100%);
  color: white;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.form-field {
  margin-bottom: 16px;
}

.dialog-actions {
  padding: 16px 24px;
  background-color: #f7f9fa;
  border-top: 1px solid #e0e0e0;
  justify-content: flex-end;
}

.cancel-btn {
  color: #555;
  margin-right: 8px;
}

.save-btn {
  background-color: #009688;
  color: white;
  font-weight: 500;
}

.modern-table {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.modern-table .v-data-table-header {
  background-color: #f9fafb;
  color: #37474f;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modern-table .v-data-table__tr:hover {
  background-color: #f0f4f8 !important;
}
</style>