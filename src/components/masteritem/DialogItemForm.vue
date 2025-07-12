<template>
  <v-dialog v-model="localDialog" max-width="600px" persistent>
    <v-card class="dialog-card" rounded="xl">
      <!-- Header -->
      <v-card-title class="dialog-header">
        <v-icon size="26" class="mr-3">{{ isEdit ? 'mdi-pencil-outline' : 'mdi-plus-box-outline' }}</v-icon>
        <span class="text-h6 font-weight-medium">
          {{ isEdit ? 'Edit Item' : 'Create New Item' }}
        </span>
      </v-card-title>

      <!-- Form Fields -->
      <v-card-text class="pa-6">
        <v-text-field
          v-model="localItem.item_name"
          label="Item Name"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-tag-text-outline"
          class="form-field"
          clearable
        />

        <v-row dense>
          <v-col
            v-for="field in allFields"
            :key="field.model"
            cols="12"
            sm="6"
          >
            <v-autocomplete
              v-if="field.items"
              v-model="localItem[field.model]"
              :label="field.label"
              :items="field.items"
              :item-title="field.itemTitle"
              :item-value="field.itemValue"
              variant="outlined"
              density="comfortable"
              clearable
              hide-no-data
              class="form-field"
            />
            <v-text-field
              v-else
              v-model="localItem[field.model]"
              :label="field.label"
              variant="outlined"
              density="comfortable"
              clearable
              class="form-field"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="dialog-actions">
        <v-btn
          prepend-icon="mdi-shape-plus"
          color="cyan-darken-1"
          variant="text"
          class="add-category-btn"
          @click="$emit('add-category')"
        >
          Add Category
        </v-btn>
        <v-spacer />
        <v-btn
          variant="text"
          class="cancel-btn"
          @click="$emit('close')"
        >
          Cancel
        </v-btn>
        <v-btn
          color="cyan-darken-1"
          variant="elevated"
          class="save-btn"
          @click="$emit('submit', localItem)"
        >
          {{ isEdit ? 'Save Changes' : 'Create Item' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue';
import type { MasterItem, Field } from '@/types/MasterItem';

// 1. Define props and emits
const props = defineProps<{
  dialog: boolean;
  isEdit: boolean;
  editedItem: Partial<MasterItem>;
  allFields: Field[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', item: Partial<MasterItem>): void;
  (e: 'add-category'): void;
  (e: 'update:dialog', val: boolean): void;
}>();

// 2. Create a local ref for dialog
const localDialog = ref(props.dialog);
const localItem = reactive<Partial<MasterItem>>({});

watch(
  () => [props.dialog, props.editedItem],
  ([dialog, newVal]) => {
    if (dialog && newVal) {
      Object.assign(localItem, newVal);
    }
  },
  { immediate: true }
);

// 3. Sync parent prop → local state
watch(() => props.dialog, (val) => {
  localDialog.value = val;
});

// 4. Sync local state → emit to parent
watch(localDialog, (val) => {
  emit('update:dialog', val);
});
</script>

<style scoped>
.dialog-card {
  box-shadow: 0 10px 30px -5px rgba(0,0,0,0.2) !important;
  background: #f9f9f9;
}

.dialog-header {
  background: linear-gradient(to right, #00BCD4, #4DD0E1); /* Cyan shades */
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
  background-color: #00BCD4;
  color: white;
  font-weight: 500;
}

.add-category-btn {
  color: #00BCD4;
}
</style>