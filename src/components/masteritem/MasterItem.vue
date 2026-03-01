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
        editedIndex = -1;
      "
    />

    <!-- Master Item Table -->
    <TableItem
      :headers="headers"
      :items="mItems"
      :search="search"
      :loading="loading"
      :loadingEditItem="loadingDetailKey"
      :loadingDeactivateItem="loadingDeactivateKey"
      @edit="editItem"
      @submit="onCreateItem"
      @deactivate="deactivateItem"
    />

    <!-- Error & Success Snackbars -->
    <SnackbarError :messages="validationErrorMessages" v-model="validationShowError" :timeout="2000" />
    <SnackbarSuccess v-model="hasSaved" message="Action completed successfully!" />

    <!-- Create/Edit Master Item Dialog -->
    <DialogItemForm
      :loadingSave="loadingSaveButton"
      :loadingCancel="loadingCancelButton"
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
      :loadingSave="loadingSaveButton"
      :loadingCancel="loadingCancelButton"
      :dialog="DialogOpenCategory"
      :newCategory="selectedCategory"
      :search="searchCategory"
      @update:search="searchCategory = $event"
      :categories="categories"
      :headers="localHCategory"
      :loading="loading"
      @close="onCloseCategory"
      @submit="onCreateCategory"
      @deactivate="deactivateCategory"
      @updateCategory="onUpdateCategory"
    />

    <!-- Deactivate Dialog -->
    <DialogDeactivate
      :loadingSave="loadingSaveButton"
      :loadingCancel="loadingCancelButton"
      :dialog="dialogDeactivate"
      title="Change Item Status?"
      message="Are you sure you want to deactivate this item?"
      @confirm="onDeactivateItem"
      @cancel="close"
    />

    <!-- Deactivate Category Dialog -->
    <DialogDeactivate
      :loadingSave="loadingSaveButton"
      :loadingCancel="loadingCancelButton"
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
import { headers, type CategoryItem, type MasterItem } from '@/types/MasterItem'; 
import { onMounted, ref } from 'vue';
import { useMasterItem } from '@/composables/useMasterItem';
import { useCategoryItem } from '@/composables/useCategoryItem';
import { useGlobal } from '@/composables/useGlobal';

  /* ======================================================*
   * COMPOSABLES                                           *
   * ======================================================*/
const{
  validationErrorMessages,
  validationShowError,
  validationError,
} = useGlobal();

const {
  
  dialogDeactivate,
  dialogDeactivateCategory,

  search,
  editedIndex,
  editedItem,
  defaultItem,
  allFields,

  mItems,
  createItem,
  loadMasterItem,
  loadCategories,
  deactiveItem,

  hasSaved,
  loading,
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
  onLoadMasterItem();
  onLoadCategories();
});

  /* ======================================================*
   * CONSTANTS                                             *
   * ======================================================*/
const loadingSaveButton = ref<boolean>(false);
const loadingCancelButton = ref<boolean>(false);
const loadingDetailKey = ref<string | null>(null);
const loadingDeactivateKey = ref<string | null>(null);

  /* ======================================================*
   * METHODS                                               *
   * ======================================================*/

const editItem = (item: MasterItem) => {
  loadingDetailKey.value = `${item.id}`;
  setTimeout(() => {
    loadingDetailKey.value = null;
  }, 400);
  editedIndex.value = mItems.value.indexOf(item);
  Object.assign(editedItem, item);
  DialogOpenCreate.value = true;
};

const close = () => {

  loadingCancelButton.value = true;
  setTimeout(() => {
    loadingCancelButton.value = false;
    DialogOpenCreate.value = false;
    dialogDeactivate.value = false;
    dialogDeactivateCategory.value = false;
    editedIndex.value = -1;
  }, 400);
}

const resetEditedItem = () => {
  Object.assign(editedItem, defaultItem);
};

const onSubmit = (item: Partial<MasterItem>) => {
  Object.assign(editedItem, item); 
  onCreateItem(); 
};

const deactivateItem = (item: MasterItem) => {
  loadingDeactivateKey.value = `${item.id}`;
  setTimeout(() => {
    loadingDeactivateKey.value = null;
  }, 400);
  Object.assign(editedItem, item);
  dialogDeactivate.value = true;
};

const deactivateCategory = (item: CategoryItem) => {
  Object.assign(newCategory, item);
  dialogDeactivateCategory.value = true;
};

const onLoadMasterItem = async () => {
  try {
    await loadMasterItem();
  } catch (e) {
    validationError(e);
  }
};

const onLoadCategories = async () => {
  try {
    await loadCategories();
  } catch (e) {
    validationError(e);
  }
};

const onCreateItem = async () => {
  loadingSaveButton.value = true;
  try {
    await createItem();
    DialogOpenCreate.value = false;
  } catch (e) {
    validationError(e);
  } finally {
    loadingSaveButton.value = false;
  }
};

const onDeactivateItem = async () => {
  loadingSaveButton.value = true;
  try {
    await deactiveItem();
    dialogDeactivate.value = false;
  } catch (e) {
    validationError(e);
  } finally {
    loadingSaveButton.value = false;
  }
};

const onCreateCategory = async (item: Partial<CategoryItem>) => {
  loadingSaveButton.value = true;
  try {
    await createCategory(item);
    
    //reset only when succed
    newCategory.name = '';
    DialogOpenCategory.value = false;
  } catch (e) {
    validationError(e);
  } finally {
    loadingSaveButton.value = false;
  }
};

const onDeactivatedCategory = async () => {
  loadingSaveButton.value = true;
  try {
    await deactiveCategory();
    dialogDeactivateCategory.value = false;
  } catch (e) {
    validationError(e);
  } finally {
    loadingSaveButton.value = false;
  }
};

const onCloseCategory = () => {
  loadingCancelButton.value = true;
  setTimeout(() => {
    loadingCancelButton.value = false;
    onClose();
  }, 500);
};
</script>