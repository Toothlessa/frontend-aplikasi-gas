<template>
  <v-dialog :v-model="dialog" max-width="700px" persistent>
    <v-card class="rounded-xl elevation-12">
      <v-card-title class="bg-cyan-darken-2 text-white d-flex align-center">
        <v-icon size="28" class="mr-2">{{ isEdit ? 'mdi-update' : 'mdi-new-box' }}</v-icon>
        <span class="text-h6 font-weight-medium">
          {{ isEdit ? 'Edit Item' : 'Create Item' }}
        </span>
      </v-card-title>

      <v-card-text class="py-6 px-4">
        <v-text-field
          :v-model="editedItem.item_name"
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
              :v-model="editedItem[field.model]"
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
              :v-model="editedItem[field.model]"
              :label="field.label"
              variant="outlined"
              density="comfortable"
              clearable
              @keyup.enter="field.onEnterSubmit && $emit('submit')"
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
          @click="$emit('submit')"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { MasterItem, Field } from '@/types/masteritem';

const props = defineProps<{
  dialog: boolean;
  isEdit: boolean;
  editedItem: Partial<MasterItem>;
  allFields: Field[];
}>();

const emit = defineEmits(['close', 'submit', 'add-category']);
</script>
