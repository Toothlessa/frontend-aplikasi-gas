<template>
  <v-container fluid class="pa-0">

    <ToolbarSimple
      title="Manage Items"
      icon="mdi-new-box"
      :search="search"
      @update:search="search = $event"
      @create="
        openCreateDialog = true;
        resetEditedItem();
        error = '';
        editedIndex = -1;
      "
    />

    <!-- Error Snackbar -->
     <SnackbarError :messages="Array.isArray(error) ? error : [error]" v-model="showError" :timeout="4000" />
     
    <!-- Success Snackbar -->
     <SnackbarSuccess v-model="hasSaved" message="Item has been saved successfully!" />

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

    <!-- Create/Edit Master Item Dialog -->
    <DialogItemForm
      :dialog="openCreateDialog"
      :isEdit="editedIndex !== -1"
      :editedItem="editedItem"
      :allFields="allFields"
      @close="close"
      @submit="onSubmit"
      @add-category="openCategoryDialog = true, selectedCategory = {}"
    />

    <!-- Add New Category Dialog -->
    <DialogCategory
      :dialog="openCategoryDialog"
      :newCategory="selectedCategory"
      :search="searchCategory"
       @update:search="searchCategory = $event"
      :categories="categories"
      :headers="localHCategory"
      :loading="loading"
      @close="onClose"
      @submit="onCreateCategory"
      @deactivate="deactivateCategory"
      @updateCategory="onEditCategory"
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
// components
import { SnackbarError, SnackbarSuccess, ToolbarSimple } from '@/components/globalcomponent';
import TableItem from './TableItem.vue';
import DialogItemForm from './DialogItemForm.vue';
import DialogCategory from './DialogCategory.vue';
import DialogDeactivate from './DialogDeactivate.vue'; 

// import SuccessSnackbar from '@/components/globalcomponent/SuccessSnackbar.vue';
import { ref, reactive, computed, onMounted, } from 'vue';
import { useStore } from 'vuex';
import { 
  LOAD_CATEGORY_ITEM, 
  LOAD_MASTER_ITEM, 
  CREATE_ITEM, 
  DEACTIVATE_ITEM, 
  CREATE_CATEGORY_ITEM,
  SET_HASSAVED,
  DEACTIVATE_ITEM_CATEGORY,
} from '@/store/storeconstant';

import type { CategoryItem, MasterItem, Field } from '@/types/masteritem'; // ✅ type-only
import { headers, headerscategory } from '@/types/masteritem';         // ✅ runtime value

const store = useStore();

const search = ref<string>('');
const searchCategory = ref<string>('');
const openCreateDialog = ref<boolean>(false);
const openCategoryDialog = ref<boolean>(false);
const dialogDeactivate = ref<boolean>(false);
const dialogDeactivateCategory = ref<boolean>(false);

const error = ref<string | string[]>('');
const showError = ref<boolean>(false);

const mItems = computed<MasterItem[]>(() => store.state.masteritem.mItems);
const categories = computed<CategoryItem[]>(() => store.state.masteritem.categories);
const loading = computed<boolean>(() => store.state.masteritem.loading);
const hasSaved = computed({
  get: () => store.state.masteritem.hasSaved,
  set: (val: boolean) => {
    store.commit(`masteritem/${SET_HASSAVED}`, val);
  },
});

const editedIndex = ref(-1);

// Fields
const itemType = [ { name: "Asset" }, { name: "Item" },];
const localHeaders = headers; // Use the imported headers directly
const localHCategory = headerscategory;
const editedItem = reactive<Partial<MasterItem>>({});
const defaultItem: Partial<MasterItem> = {
  id: '',
  item_name: '',
  item_code: '',
  item_type: null,
  category_id: null,
  category: '',
  cost_of_goods_sold: '',
  selling_price: '',
  in_stock: false,
  active_flag: false,
};

const newCategory = reactive<Partial<CategoryItem>>({
  name: '',
  active_flag: 'Y',
  inactive_date: '',
});

const allFields = computed<Field[]>(() => [
  { model: 'item_type', label: 'Item Type', items: itemType, itemTitle: 'name' },
  { model: 'category_id', label: 'Category', items: categories.value, itemTitle: 'name', itemValue: 'id' },
  { model: 'cost_of_goods_sold', label: 'Cost of Goods' },
  { model: 'selling_price', label: 'Selling Price',  onEnterSubmit: true },
]);

onMounted(() => {
  loadMasterItem();
  loadCategories();
});

const loadMasterItem = () => store.dispatch(`masteritem/${LOAD_MASTER_ITEM}`);
const loadCategories = () => store.dispatch(`masteritem/${LOAD_CATEGORY_ITEM}`);

function editItem(item:any) {
  editedIndex.value = mItems.value.indexOf(item);
  Object.assign(editedItem, item);
  openCreateDialog.value = true;
}

function close() {
  openCreateDialog.value = false;
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
  console.log('Submitted item:', item);
  onCreateItem(); 
}

async function onCreateItem() {
  try {
    error.value = '';
    console.log('Creating item:', editedItem);

    await store.dispatch(`masteritem/${CREATE_ITEM}`, editedItem);
    openCreateDialog.value = false;
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

function deactivateItem(item:any) {
  // editedIndex.value = mItems.value.indexOf(item);
  Object.assign(editedItem, item);
  dialogDeactivate.value = true;
}

function deactivateCategory(item:any) {
  Object.assign(newCategory, item);
  console.log("deactivate category: ", item);
  console.log("editedItem: ", newCategory);
  dialogDeactivateCategory.value = true;
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

const selectedCategory = ref<Partial<CategoryItem>>({});
const onEditCategory = (item: CategoryItem) => {
  selectedCategory.value = { ...item }; // Set item to pass to the dialog
  console.log("selected category: ", selectedCategory.value);
};
const onClose = () => {
  openCategoryDialog.value = false;                // Close the dialog
  selectedCategory.value = {};         // Clear the selected data
  console.log('selectcetCategory: ' ,selectedCategory.value);
};


async function onCreateCategory(item: Partial<CategoryItem>) {
  console.log("catogory: ", item);
  try {
    error.value = '';

    await store.dispatch(`masteritem/${CREATE_CATEGORY_ITEM}`, item);
    openCategoryDialog.value = false;
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