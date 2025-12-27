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
      @confirm="onDeactivateItem"
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
import type { CategoryItem, MasterItem } from '@/types/MasterItem'; // ✅ type-only

import { onMounted } from 'vue';
import { useMasterItem } from '@/composables/useMasterItem';
import { useCategoryItem } from '@/composables/useCategoryItem';
import { useGlobal } from '@/composables/useGlobal';

  /* ======================================================*
   * COMPOSABLES                                           *
   * ======================================================*/
const{
  handleError,
} = useGlobal();

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
  createItem,
  loadMasterItem,
  loadCategories,
  deactiveItem,

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

    createCategory,
    deactiveCategory,
    onUpdateCategory,
    onClose,
} = useCategoryItem();

  /* ======================================================*
   * LIFECYCLE HOOKS                                       *
   * ======================================================*/
onMounted(() => {
  loadMasterItem();
  loadCategories();
});

  /* ======================================================*
   * METHODS                                             *
   * ======================================================*/

const editItem = (item: MasterItem) => {
  editedIndex.value = mItems.value.indexOf(item);
  Object.assign(editedItem, item);
  DialogOpenCreate.value = true;
};

const close = () => {
  DialogOpenCreate.value = false;
  dialogDeactivate.value = false;
  dialogDeactivateCategory.value = false;
  editedIndex.value = -1;
}

const resetEditedItem = () => {
  Object.assign(editedItem, defaultItem);
};

const onSubmit = (item: Partial<MasterItem>) => {
  Object.assign(editedItem, item); 
  onCreateItem(); 
};

const deactivateItem = (item: MasterItem) => {
  Object.assign(editedItem, item);
  dialogDeactivate.value = true;
};

const deactivateCategory = (item: CategoryItem) => {
  Object.assign(newCategory, item);
  dialogDeactivateCategory.value = true;
};

const onCreateItem = async () => {
  try {
    error.value = '';
    await createItem();
    DialogOpenCreate.value = false;
  } catch (e) {
    handleError(e);
    showError.value = true;
  }
};

const onDeactivateItem = async () => {
  try {
    error.value = '';
    await deactiveItem();
    dialogDeactivate.value = false;
  } catch (e) {
    handleError(e);
    showError.value = true;
  }
};

const onCreateCategory = async (item: Partial<CategoryItem>) => {
  try {
    error.value = '';

    await createCategory(item);
    DialogOpenCategory.value = false;
    newCategory.name = '';
  } catch (e) {
    handleError(e);
    showError.value = true;
  }
};

const onDeactivatedCategory = async () => {
  try {
    error.value = '';
    await deactiveCategory();
    dialogDeactivateCategory.value = false;
  } catch (e) {
    handleError(e);
    showError.value = true;
  }
};
</script>