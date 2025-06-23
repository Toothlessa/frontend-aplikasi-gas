<template>
  <v-dialog v-model="localDialog" max-width="700px" persistent>
    <v-card class="rounded-xl elevation-12">
      <!-- Header -->
      <v-card-title class="bg-cyan-darken-2 text-white d-flex align-center">
        <v-icon size="24" class="mr-2">mdi-new-box</v-icon>
        <span class="text-h6 font-weight-medium">Add New Category</span>
      </v-card-title>

      <!-- Form -->
      <v-card-text class="px-4 pt-6">
        <v-text-field
          v-model="localCategory.name"
          label="Category Name"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-tag"
          clearable
          class="mb-4"
        />
      </v-card-text>

      <!-- Buttons -->
      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn
          variant="text"
          color="grey-darken-2"
          class="text-white"
          @click="$emit('close')"
        >
          Close
        </v-btn>
        <v-btn
          color="cyan-darken-1"
          variant="elevated"
          class="text-white"
          @click="$emit('submit', localCategory)"
        >
          Save
        </v-btn>
      </v-card-actions>

      <!-- Search Bar -->
      <v-toolbar flat class="bg-cyan-lighten-5 px-4 pt-2" density="comfortable">
        <v-text-field
          :model-value="search"
          @update:model-value="$emit('update:search', $event)"
          label="Search Categories"
          variant="solo-filled"
          density="comfortable"
          prepend-inner-icon="mdi-magnify"
          clearable
          class="flex-grow-1"
        />
      </v-toolbar>

      <!-- Table -->
      <v-data-table-virtual
        :headers="headers"
        :items="filteredItems"
        class="px-4 pb-6"
        :filter-keys="['name']"
        :loading="loading"
        loading-text="Loading categories..."
        density="comfortable"
        item-value="id"
        hover
      >
        <template v-slot:[`item.active_flag`]="{ item }">
          <v-chip
            :color="item.active_flag ? 'green-darken-2' : 'red-darken-2'"
            class="text-white"
            size="small"
            label
          >
            {{ item.active_flag ? 'Active' : 'Inactive' }}
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            icon
            size="small"
            color="primary"
            variant="text"
            class="mr-1"
            @click="$emit('updateCategory', item)"
          >
            <v-icon size="18">mdi-pencil-outline</v-icon>
          </v-btn>
          
          <v-btn
            icon
            size="small"
            variant="text"
            color="red-darken-2"
            @click="$emit('deactivate', item)"
          >
            <v-icon size="18">mdi-radioactive</v-icon>
          </v-btn>
        </template>
      </v-data-table-virtual>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed } from 'vue';
import type { CategoryItem, HeaderCategory } from '@/types/masteritem';

const props = defineProps<{
  dialog: boolean;
  newCategory: Partial<CategoryItem>;
  search: string;
  categories: CategoryItem[];
  headers: HeaderCategory[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', item: Partial<CategoryItem>): void;
  (e: 'updateCategory', item: CategoryItem): void;
  (e: 'deactivate', item: CategoryItem): void;
  (e: 'update:dialog', val: boolean): void;
  (e: 'update:search', search: string): void;
}>();

const localDialog = ref(props.dialog);
const localCategory = reactive<Partial<CategoryItem>>({});

watch(() => props.dialog, (val) => {
  localDialog.value = val;
  emit('update:dialog', val);
  console.log('Dialog state changed:', val);
  
  if (val && props.newCategory) {
    // Dialog opened — fill localCategory
    Object.assign(localCategory, props.newCategory);
  } else if (!val) {
    // Dialog closed — clear localCategory
    Object.assign(localCategory, {});
    console.log('Dialog closed, clearing localCategory', localCategory);
  }
});

// Filtered category list
const filteredItems = computed(() => {
  if (!props.search) return props.categories;

  const keyword = props.search.toLowerCase();
  return props.categories.filter(item =>
    item.name?.toLowerCase().includes(keyword)
  );
});
</script>
