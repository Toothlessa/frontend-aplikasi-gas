<template>
  <v-dialog v-model="localDialog" max-width="700px" persistent>
    <v-card class="dialog-card" rounded="xl">
      <!-- Header -->
      <v-card-title class="dialog-header">
        <v-icon size="26" class="mr-3">mdi-shape-plus</v-icon>
        <span class="text-h6 font-weight-medium">Manage Categories</span>
      </v-card-title>

      <!-- Form -->
      <v-card-text class="px-6 pt-6">
        <v-text-field
          v-model="localCategory.name"
          label="Category Name"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-tag-plus-outline"
          clearable
          class="form-field"
        />

        <v-text-field
          v-model="localCategory.prefix"
          label="Prefix"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-tag-plus-outline"
          clearable
          class="form-field"
        />
      </v-card-text>

      <!-- Buttons -->
      <v-card-actions class="dialog-actions">
        <v-spacer />
        <v-btn
          variant="text"
          class="cancel-btn"
          @click="handleClose"
        >
          Close
        </v-btn>
        <v-btn
          color="cyan-darken-1"
          variant="elevated"
          class="save-btn"
          @click="handleSave"
        >
          Save Category
        </v-btn>
      </v-card-actions>

      <!-- Search Bar -->
      <v-toolbar flat class="category-search-toolbar" density="comfortable">
        <v-text-field
          :model-value="search"
          @update:model-value="$emit('update:search', $event)"
          label="Search Categories"
          variant="solo"
          density="comfortable"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          class="search-field-category"
        />
      </v-toolbar>

      <!-- Table -->
      <v-data-table-virtual
        :headers="headers"
        :items="filteredItems"
        class="modern-table-category"
        :filter-keys="['name']"
        :loading="loading"
        loading-text="Loading categories..."
        density="comfortable"
        item-value="id"
        hover
      >
      
        <template #[`item.active_flag`]="{ item }">
          <v-chip
            :color="item.active_flag ? '#00BCD4' : '#9E9E9E'" 
            class="status-chip"
            label
            size="small"
          >
            {{ item.active_flag ? 'Active' : 'Inactive' }}
          </v-chip>
        </template>

        <template #[`item.actions`]="{ item }">
          <div class="action-buttons">
            <v-tooltip text="Edit Category" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="small"
                  color="cyan-darken-1"
                  variant="text"
                  @click="$emit('updateCategory', item)"
                >
                  <v-icon size="22">mdi-pencil-outline</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            
            <v-tooltip :text="item.active_flag ? 'Deactivate Category' : 'Activate Category'" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="small"
                  variant="text"
                  color="red-darken-2"
                  @click="$emit('deactivate', item)"
                >
                  <v-icon size="22">{{ item.active_flag ? 'mdi-toggle-switch-off-outline' : 'mdi-toggle-switch-outline' }}</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table-virtual>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed } from 'vue';
import type { CategoryItem, HeaderCategory } from '@/types/MasterItem';

/* ======================================================*
 * PROPS                                                  *
 * ======================================================*/
const props = defineProps<{
  dialog: boolean;
  newCategory: Partial<CategoryItem>;
  search: string;
  categories: CategoryItem[];
  headers: HeaderCategory[];
  loading: boolean;
}>();

/* ======================================================*
 * EMITS                                                  *
 * ======================================================*/
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', item: Partial<CategoryItem>): void;
  (e: 'updateCategory', item: CategoryItem): void;
  (e: 'deactivate', item: CategoryItem): void;
  (e: 'update:dialog', val: boolean): void;
  (e: 'update:search', search: string): void;
}>();

/* ======================================================*
 * STATE — DIALOG                                         *
 * ======================================================*/
const localDialog = ref<boolean>(props.dialog);

/* ======================================================*
 * STATE — CATEGORY                                       *
 * ======================================================*/
const localCategory = reactive<Partial<CategoryItem>>({});

const defaultCategory: Partial<CategoryItem> = {
  id: 0,
  name: '',
  active_flag: 'Y',
  inactive_date: '',
};

/* ======================================================*
 * WATCHERS                                               *
 * ======================================================*/

// Sync dialog state with parent
watch(
  () => props.dialog,
  (val) => {
    localDialog.value = val;
    emit('update:dialog', val);
  }
);

// Fill localCategory when dialog opens & newCategory changes
watch(
  () => props.newCategory,
  (newVal) => {
    if (localDialog.value && newVal) {
      Object.assign(localCategory, newVal);
    }
  },
  { immediate: true }
);

/* ======================================================*
 * COMPUTED                                               *
 * ======================================================*/
const filteredItems = computed(() => {
  if (!props.search) return props.categories;

  const keyword = props.search.toLowerCase();
  return props.categories.filter(item =>
    item.name?.toLowerCase().includes(keyword)
  );
});

/* ======================================================*
 * METHODS — ACTION HANDLERS                               *
 * ======================================================*/
const handleClose = () => {
  emit('close'); // Let parent clear state
  Object.assign(localCategory, defaultCategory);
};

const handleSave = () => {
  emit('submit', localCategory);
  Object.assign(localCategory, defaultCategory);
};
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
  background-color: #1e88e5;
  color: white;
  font-weight: 500;
}

.category-search-toolbar {
  background-color: rgba(0, 188, 212, 0.1) !important; /* Light cyan background */
  border-bottom: 1px solid #bbdefb;
  padding: 8px 24px;
}

.search-field-category {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
}

.modern-table-category {
  border-radius: 0 0 16px 16px; /* Rounded bottom corners */
  overflow: hidden;
  box-shadow: none; /* Remove shadow as it's on the card */
  border: none;
}

.modern-table-category .table-header {
  background-color: #f5f5f5; /* Light grey background */
  color: #333; /* Darker text for contrast */
  font-size: 0.8rem;
}

.modern-table-category .status-chip {
  color: white;
  font-weight: bold;
  border-radius: 6px;
}

.modern-table-category .action-buttons .v-btn {
  color: #757575; /* Grey for actions */
  transition: color 0.2s ease, transform 0.2s ease;
}

.modern-table-category .action-buttons .v-btn:hover {
  color: #00ACC1; /* Cyan on hover */
  transform: scale(1.1);
}

.modern-table-category .v-data-table-virtual__tr:hover {
  background-color: #f9f9f9 !important;
}

.modern-table-category thead th {
  text-transform: uppercase;
  font-weight: bold;
  padding: 12px 16px;
}

</style>
