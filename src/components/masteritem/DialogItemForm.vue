<template>
  <v-dialog v-model="localDialog" max-width="700px" persistent>
    <v-card class="rounded-xl elevation-12">
      <v-card-title class="bg-cyan-darken-2 text-white d-flex align-center">
        <v-icon size="28" class="mr-2">{{ isEdit ? 'mdi-update' : 'mdi-new-box' }}</v-icon>
        <span class="text-h6 font-weight-medium">
          {{ isEdit ? 'Edit Item' : 'Create Item' }}
        </span>
      </v-card-title>

      <v-card-text class="py-6 px-4">
        <v-text-field
          v-model="localItem.item_name"
          label="Item Name"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-tag"
          class="mb-4"
          clearable
        />

        <v-row dense>
          <v-col
            v-for="field in allFields"
            :key="field.model"
            cols="12"
            sm="6"
            class="mb-3"
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
            />
            <v-text-field
              v-else
              v-model="localItem[field.model]"
              :label="field.label"
              variant="outlined"
              density="comfortable"
              clearable
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn
          prepend-icon="mdi-shape-plus"
          color="cyan-darken-1"
          variant="elevated"
          class="text-white"
          @click="$emit('add-category')"
        >
          Add Category
        </v-btn>
        <v-btn
          color="grey-darken-1"
          variant="text"
          class="text-white"
          @click="$emit('close')"
        >
          Cancel
        </v-btn>
        <v-btn
          color="cyan-darken-2"
          variant="elevated"
          class="text-white"
          @click="$emit('submit', localItem)"
        >
          Save
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
