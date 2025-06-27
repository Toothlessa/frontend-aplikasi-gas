<template>
  <v-dialog v-model="localDialog" max-width="700px" persistent>
    <v-card class="rounded-xl elevation-12">
      <v-card-title class="bg-blue-accent-2 text-white d-flex align-center">
        <v-icon size="28" class="mr-2">{{ isEdit ? 'mdi-update' : 'mdi-new-box' }}</v-icon>
        <span class="text-h6 font-weight-medium">
          {{ isEdit ? 'Edit Customer' : 'Create Customer' }}
        </span>
      </v-card-title>

      <v-card-text class="py-6 px-4">

        <v-row dense>
          <v-col
            v-for="field in allFields"
            :key="field.model"
            cols="12"
            sm="6"
            class="mb-3"
          >
            <v-text-field
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
          color="grey-darken-1"
          variant="text"
          class="text-white"
          @click="$emit('close')"
        >
          Cancel
        </v-btn>
        <v-btn
          color="blue-accent-4"
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
import type { Customer, CustomerField } from '@/types/Customer';

// 1. Define props and emits
const props = defineProps<{
  dialog: boolean;
  isEdit: boolean;
  editedItem: Partial<Customer>;
  allFields: CustomerField[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', item: Partial<Customer>): void;
  (e: 'update:dialog', val: boolean): void;
}>();

// 2. Create a local ref for dialog
const localDialog = ref(props.dialog);
const localItem = reactive<Partial<Customer>>({});

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
