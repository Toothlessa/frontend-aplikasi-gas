<template>
  <v-container fluid>

    <!-- Toolbar Actions -->
    <v-toolbar 
      class="bg-cyan text-white"  
      rounded="lg"
    >
      <v-btn 
        style="color: white;"
        rounded="xl" 
        icon
        @click="openCreateDialog = true, resetEditedItem(), error = '', editedIndex = -1;"
      >
          <v-icon>mdi-new-box</v-icon>
      </v-btn>

      <v-spacer />

      <v-text-field
        v-model="search"
        label="Search by item name"
        variant="solo-filled"
        class="mr-4"
        style="max-width: 500px;"
        density="compact"
        prepend-inner-icon="mdi-magnify"
        flat
      />
    </v-toolbar>

    <!-- Error Snackbar -->
     <v-snackbar
        v-model="showError"
        :timeout="5000"
        color="red-darken-2"
        location="top center"
        multi-line
        elevation="6"
      >
        <ul class="pl-4 list-disc">
          <li v-for="(e, i) in error" :key="i">{{ e }}</li>
        </ul>
        <template #actions>
          <v-btn variant="text" icon @click="showError = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="hasSaved"
      :timeout="5000"
      color="green-accent-3"
      location="top center"
      multi-line
      elevation="6"
    >
      Data saved successfully!
    </v-snackbar>

    <!-- Master Item Table -->
    <v-data-table-virtual
      :headers="localHeaders"
      :items="mItems"
      class="elevation-12 bg-cyan-lighten-5 text-black"
      v-model:search="search" 
      :filter-keys="['item_name']" 
      :loading="loading"
      loading-text="Loading... Please wait"
    >
      <template v-slot:[`item.in_stock`]="{ item }">
        <v-chip :color="item.in_stock ? 'green' : 'red'" :text="item.in_stock ? 'In stock' : 'Out of stock'" class="text-uppercase" size="small" label />
      </template>
      <template v-slot:[`item.active_flag`]="{ item }">
        <v-chip :color="item.active_flag ? 'green' : 'black'" size="small" label>
          {{ item.active_flag ? 'Active' : 'Inactive' }}
        </v-chip>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon size="small" class="mr-2" @click="editItem(item)">mdi-pencil-outline</v-icon>
        <v-icon size="small" @click="deactivateItem(item)">mdi-radioactive</v-icon>
      </template>
    </v-data-table-virtual>

    <!-- Create/Edit Master Item Dialog -->
    <v-dialog v-model="openCreateDialog" max-width="600px">
      <v-card>
        <v-card-title class="text-white text-h5 font-weight-regular bg-cyan">
          <v-icon size="40">{{ formIcon }}</v-icon> {{ formTitle }}
        </v-card-title>

        <v-card-text>
                <v-text-field v-model="editedItem.item_name" label="Item Name" variant="outlined" />
                <v-row>
                  <v-col v-for="field in allFields" :key="field.model" cols="12" sm="6">
                    <v-autocomplete
                      v-if="field.items"
                      v-model="editedItem[field.model]"
                      :label="field.label"
                      :items="field.items"
                      :item-title="field.itemTitle"
                      :item-value="field.itemValue"
                      variant="outlined"
                    />
                    <v-text-field
                      v-else
                      v-model="editedItem[field.model]"
                      :label="field.label"
                      variant="outlined"
                      v-on:keyup.enter="field.onEnterSubmit && onCreateItem()"
                    />
                  </v-col>
                </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn class="text-white" prepend-icon="mdi-shape-plus" color="cyan" variant="elevated" @click="openCategoryDialog = true">Add Category</v-btn>
          <v-btn class="text-white" color="cyan" variant="elevated" @click="close">Cancel</v-btn>
          <v-btn class="text-white" color="cyan" variant="elevated" @click="onCreateItem">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add new category -->
    <v-dialog v-model="openCategoryDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-white text-h5 font-weight-regular bg-cyan">
          <v-icon size="40"> mdi-new-box </v-icon> Add Category
        </v-card-title>

        <v-card-text>
                <v-text-field v-model="newCategory.name" label="Category Name" variant="outlined" />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn class="text-white" color="cyan" variant="elevated" @click="openCategoryDialog = false">Close</v-btn>
          <v-btn class="text-white" color="cyan" variant="elevated" @click="onCreateCategory">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete/Deactivate Master Item Dialog -->
    <v-dialog v-model="dialogDeactivate" max-width="500px">
      <v-card class="elevation-12" variant="elevated">
        <v-card-title class="bg-cyan text-white text-h5 text-center">
          Change Item Status?
        </v-card-title>

        <v-card-actions class="justify-center">
          <v-btn icon color="cyan" variant="text" @click="close">
            <v-icon size="30">mdi-cancel</v-icon>
          </v-btn>

          <v-btn icon color="cyan" variant="text" @click="onDeactivated">
            <v-icon size="30">mdi-pokeball</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup lang="ts">

import { ref, reactive, computed, onMounted, } from 'vue';
import { useStore } from 'vuex';
import { LOAD_CATEGORY_ITEM, LOAD_MASTER_ITEM, CREATE_ITEM, DEACTIVATE_ITEM, CREATE_CATEGORY_ITEM, } from '@/store/storeconstant';

import type { CategoryItem, MasterItem } from '@/types/masteritem'; // ✅ type-only
import { headers } from '@/types/masteritem';         // ✅ runtime value

const store = useStore();

const search = ref<string>('');
const openCreateDialog = ref<boolean>(false);
const openCategoryDialog = ref<boolean>(false);
const dialogDeactivate = ref<boolean>(false);


const error = ref<string | string[]>('');
const showError = ref<boolean>(false);

const localHeaders = headers; // Use the imported headers directly
const editedIndex = ref(-1);

const mItems = computed<MasterItem[]>(() => store.state.masteritem.mItems);
const categories = computed<MasterItem[]>(() => store.state.masteritem.categories);
const itemType = [ { name: "Asset" }, { name: "Item" },];
const hasSaved = computed<boolean>(() => store.state.masteritem.hasSaved);
const loading = computed<boolean>(() => store.state.masteritem.loading);

const formIcon = computed<string>(() => editedIndex.value === -1 ? 'mdi-new-box' : 'mdi-update');
const formTitle = computed<string>(() => editedIndex.value === -1 ? 'Create Customer' : 'Edit Customer');

// Fields
const editedItem = reactive<Partial<MasterItem>>({});
const defaultItem: Partial<MasterItem> = {
  id: '',
  item_name: '',
  item_code: '',
  item_type: '',
  category_id: '',
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

type MasterItemKey = keyof MasterItem;

interface Field {
  model: MasterItemKey;
  label: string;
  items?: any[];          // Optional
  itemTitle?: string;     // Optional
  itemValue?: string;     // Optional
  onEnterSubmit?: boolean;
}

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
  editedIndex.value = -1;
}

function resetEditedItem() {
// Reset like this
Object.assign(editedItem, defaultItem);
}

async function onCreateItem() {
  try {
    error.value = '';
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
  editedIndex.value = mItems.value.indexOf(item);
  Object.assign(editedItem, item);
  dialogDeactivate.value = true;
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

async function onCreateCategory() {
  console.log("catogory: ", newCategory.name);
  try {
    error.value = '';
    await store.dispatch(`masteritem/${CREATE_CATEGORY_ITEM}`, newCategory);
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


</script>