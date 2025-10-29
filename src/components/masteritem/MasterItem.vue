<template>
  <v-container fluid class="pa-4 rounded-xl elevation-12">
    <ToolbarSimple
      title="Manage Items"
      icon="mdi-package-variant-closed"
      color="cyan"
      :search="search"
      :showUploadButton="false"
      @update:search="search = $event"
      @create="
        DialogOpenCreate = true;
        resetEditedItem();
        error = '';
        editedIndex = -1;
      "
    />

    <!-- Master Item Table -->
    <TableItem
      :headers="localHeaders"
      :items="mItems"
      :search="search"
      :loading="loading"
      @edit="editItem"
      @submit="onCreateItem"
      @deactivate="deactivateItem"
    />
      

    <!-- Error Snackbar -->
    <SnackbarError :messages="Array.isArray(error) ? error : [error]" v-model="showError" :timeout="4000" />

    <!-- Success Snackbar -->
    <SnackbarSuccess v-model="hasSaved" message="Item has been saved successfully!" />

    <!-- Create/Edit Master Item Dialog -->
    <DialogItemForm
      :dialog="DialogOpenCreate"
      :isEdit="editedIndex !== -1"
      :editedItem="editedItem"
      :allFields="allFields"
      @close="close"
      @submit="onSubmit"
      @add-category="DialogOpenCategory = true, selectedCategory = {}"
    />

    <!-- Add New Category Dialog -->
    <DialogCategory
      :dialog="DialogOpenCategory"
      :newCategory="selectedCategory"
      :search="searchCategory"
      @update:search="searchCategory = $event"
      :categories="categories"
      :headers="localHCategory"
      :loading="loading"
      @close="onClose"
      @submit="onCreateCategory"
      @deactivate="deactivateCategory"
      @updateCategory="onUpdateCategory"
    />

    <!-- Deactivate Dialog -->
    <DialogDeactivate
      :dialog="dialogDeactivate"
      title="Change Item Status?"
      message="Are you sure you want to deactivate this item?"
      @confirm="onDeactivated"
      @cancel="close"
    />

    <!-- Deactivate Category Dialog -->
    <DialogDeactivate
      :dialog="dialogDeactivateCategory"
      title="Change Category Item Status?"
      message="Are you sure you want to deactivate this category item?"
      @confirm="onDeactivatedCategory"
      @cancel="close"
    />
  </v-container>
</template>

<script setup lang="ts">
import { SnackbarError, SnackbarSuccess, ToolbarSimple } from '@/components/globalComponent';
import TableItem from './TableItem.vue';
import DialogItemForm from './DialogItemForm.vue';
import DialogCategory from './DialogCategory.vue';
import DialogDeactivate from './DialogDeactivate.vue';
import type { CategoryItem, MasterItem, Field } from '@/types/MasterItem'; // ✅ type-only

// import SuccessSnackbar from '@/components/globalcomponent/SuccessSnackbar.vue';
import {  onMounted } from 'vue';
import { 
  CREATE_ITEM, 
  DEACTIVATE_ITEM, 
  CREATE_CATEGORY_ITEM,
  DEACTIVATE_ITEM_CATEGORY,
} from '@/store/storeconstant';
import { useMasterItem } from '@/composables/useMasterItem';
import { useCategoryItem } from '@/composables/useCategoryItem';

const {
  store,
  
  dialogDeactivate,
  dialogDeactivateCategory,

  search,
  editedIndex,
  editedItem,
  defaultItem,
  localHeaders,
  allFields,

  mItems,
  loadMasterItem,
  loadCategories,

  hasSaved,
  loading,
  error,
  showError,
} = useMasterItem();

const {
    DialogOpenCategory,
    DialogOpenCreate,

    searchCategory,
    newCategory,
    selectedCategory,
    localHCategory,

    categories,

    onUpdateCategory,
    onClose,
} = useCategoryItem();

onMounted(() => {
  loadMasterItem();
  loadCategories();
});

function editItem(item: MasterItem) {
  editedIndex.value = mItems.value.indexOf(item);
  Object.assign(editedItem, item);
  DialogOpenCreate.value = true;
}

function close() {
  DialogOpenCreate.value = false;
  dialogDeactivate.value = false;
  dialogDeactivateCategory.value = false;
  editedIndex.value = -1;
}

function resetEditedItem() {
  // Reset field edit and update item
  Object.assign(editedItem, defaultItem);
}

function onSubmit(item: Partial<MasterItem>) {
  Object.assign(editedItem, item); 
  onCreateItem(); 
}

function deactivateItem(item: MasterItem) {
  // editedIndex.value = mItems.value.indexOf(item);
  Object.assign(editedItem, item);
  dialogDeactivate.value = true;
}

function deactivateCategory(item: CategoryItem) {
  Object.assign(newCategory, item);
  dialogDeactivateCategory.value = true;
}

async function onCreateItem() {
  try {
    error.value = '';
    await store.dispatch(`masteritem/${CREATE_ITEM}`, editedItem);
    DialogOpenCreate.value = false;
  } catch (e) {
    showError.value = true;
    
    if (Array.isArray(e)) {
      error.value = e; // e is string[]
    } else if (e instanceof Error) {
      error.value = e.message; // e is an Error
    } else {
      error.value = String(e); // fallback
    }
  }
}

async function onDeactivated() {
  try {
    error.value = '';

    await store.dispatch(`masteritem/${DEACTIVATE_ITEM}`, editedItem.id);
    dialogDeactivate.value = false;
  } catch (e) {
    showError.value = true;

    if (Array.isArray(e)) {
      error.value = e; // e is string[]
    } else if (e instanceof Error) {
      error.value = e.message; // e is an Error
    } else {
      error.value = String(e); // fallback
    }
  }
}

async function onCreateCategory(item: Partial<CategoryItem>) {
  try {
    error.value = '';

    await store.dispatch(`masteritem/${CREATE_CATEGORY_ITEM}`, item);
    DialogOpenCategory.value = false;
    newCategory.name = '';
  } catch (e) {
    showError.value = true;

    if (Array.isArray(e)) {
      error.value = e; // e is string[]
    } else if (e instanceof Error) {
      error.value = e.message; // e is an Error
    } else {
      error.value = String(e); // fallback
    }
  }
}

async function onDeactivatedCategory() {
  try {
    error.value = '';

    await store.dispatch(`masteritem/${DEACTIVATE_ITEM_CATEGORY}`, newCategory.id);
    dialogDeactivateCategory.value = false;
  } catch (e) {
    showError.value = true;

    if (Array.isArray(e)) {
      error.value = e; // e is string[]
    } else if (e instanceof Error) {
      error.value = e.message; // e is an Error
    } else {
      error.value = String(e); // fallback
    }
  }
}
</script>