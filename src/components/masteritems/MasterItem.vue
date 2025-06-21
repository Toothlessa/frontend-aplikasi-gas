<template>
  <v-container fluid class="pa-0">
  <!-- Toolbar Actions -->
    <v-toolbar
      flat
      class="bg-cyan-darken-2 text-white rounded-xl px-4 py-2"
    >
      <!-- Add New Item Button -->
      <v-btn
        icon
        variant="flat"
        color="white"
        size="large"
        class="mr-2"
        @click="
          openCreateDialog = true;
          resetEditedItem();
          error = '';
          editedIndex = -1;
        "
      >
        <v-icon size="28">mdi-new-box</v-icon>
      </v-btn>

      <v-toolbar-title class="text-h6 font-weight-regular">
        Manage Items
      </v-toolbar-title>

      <v-spacer />

      <!-- Search Field -->
      <v-text-field
        v-model="search"
        label="Search items"
        variant="solo-filled"
        density="comfortable"
        prepend-inner-icon="mdi-magnify"
        clearable
        class="ma-0"
        style="max-width: 400px;"
      />
    </v-toolbar>

    <!-- Error Snackbar -->
     <ErrorSnackbar v-model="showError" :messages="error" />
    <!-- <v-snackbar
      v-model="showError"
      :timeout="5000"
      location="top center"
      elevation="10"
      color="red-darken-3"
      rounded="lg"
      class="text-white shadow-lg"
      multi-line
    >
      <div class="d-flex flex-column">
        <v-icon size="24" class="mb-2 text-white">mdi-alert-circle</v-icon>
        <span class="font-weight-medium text-subtitle-2 mb-2">
          Please fix the following errors:
        </span>
        <ul class="pl-4 list-disc text-body-2">
          <li v-for="(e, i) in error" :key="i">{{ e }}</li>
        </ul>
      </div> -->

      <!-- Close Action -->
      <!-- <template #actions>
        <v-btn
          variant="text"
          icon
          color="white"
          @click="showError = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar> -->

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="hasSaved"
      :timeout="4000"
      location="top center"
      color="green-darken-2"
      elevation="10"
      rounded="lg"
      class="text-white shadow-lg px-4"
      multi-line
    >
      <div class="d-flex align-center">
        <!-- <v-icon class="mr-2">mdi-check-circle</v-icon> -->
        <span class="text-body-2 font-weight-medium">
          ✅ Data saved successfully!
        </span>
      </div>

      <!-- Close Action -->
      <template #actions>
        <v-btn icon variant="text" color="white" @click="hasSaved = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>


    <!-- Master Item Table -->
    <v-data-table-virtual
      :headers="localHeaders"
      :items="mItems"
      v-model:search="search"
      :filter-keys="['item_name']"
      :loading="loading"
      loading-text="Loading... Please wait"
      class="elevation-10 bg-cyan-lighten-5 text-black rounded-xl"
      density="comfortable"
      hover
      item-value="id"
    >
      <!-- In Stock Column -->
      <template v-slot:[`item.in_stock`]="{ item }">
        <v-chip
          :color="item.in_stock ? 'green-darken-1' : 'red-darken-1'"
          class="text-white text-uppercase"
          size="small"
          label
        >
          {{ item.in_stock ? 'In Stock' : 'Out of Stock' }}
        </v-chip>
      </template>

      <!-- Active Flag Column -->
      <template v-slot:[`item.active_flag`]="{ item }">
        <v-chip
          :color="item.active_flag ? 'cyan-darken-2' : 'grey-darken-3'"
          class="text-white"
          size="small"
          label
        >
          {{ item.active_flag ? 'Active' : 'Inactive' }}
        </v-chip>
      </template>

      <!-- Actions Column -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          icon
          size="small"
          color="primary"
          variant="text"
          class="mr-1"
          @click="editItem(item)"
        >
          <v-icon size="18">mdi-pencil-outline</v-icon>
        </v-btn>
        <v-btn
          icon
          size="small"
          color="red-darken-1"
          variant="text"
          @click="deactivateItem(item)"
        >
          <v-icon size="18">mdi-radioactive</v-icon>
        </v-btn>
      </template>
    </v-data-table-virtual>


    <!-- Create/Edit Master Item Dialog -->
    <v-dialog v-model="openCreateDialog" max-width="700px" persistent>
      <v-card class="rounded-xl elevation-12">
        <!-- Dialog Header -->
        <v-card-title class="bg-cyan-darken-2 text-white d-flex align-center">
          <v-icon size="28" class="mr-2">{{ formIcon }}</v-icon>
          <span class="text-h6 font-weight-medium">{{ formTitle }}</span>
        </v-card-title>

        <!-- Dialog Content -->
        <v-card-text class="py-6 px-4">
          <!-- Item Name -->
          <v-text-field
            v-model="editedItem.item_name"
            label="Item Name"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-tag"
            class="mb-4"
            clearable
          />

          <!-- Dynamic Fields -->
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
                v-model="editedItem[field.model]"
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
                v-model="editedItem[field.model]"
                :label="field.label"
                variant="outlined"
                density="comfortable"
                clearable
                @keyup.enter="field.onEnterSubmit && onCreateItem()"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <!-- Dialog Actions -->
        <v-card-actions class="px-4 pb-4">
          <v-spacer />
          <v-btn
            prepend-icon="mdi-shape-plus"
            color="cyan-darken-1"
            variant="elevated"
            class="text-white"
            @click="openCategoryDialog = true"
          >
            Add Category
          </v-btn>
          <v-btn
            color="grey-darken-1"
            variant="text"
            class="text-white"
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            color="cyan-darken-2"
            variant="elevated"
            class="text-white"
            @click="onCreateItem"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add New Category Dialog -->
    <v-dialog v-model="openCategoryDialog" max-width="700px" persistent>
      <v-card class="rounded-xl elevation-12">
        
        <!-- Header -->
        <v-card-title class="bg-cyan-darken-2 text-white d-flex align-center">
          <v-icon size="24" class="mr-2">mdi-new-box</v-icon>
          <span class="text-h6 font-weight-medium">Add New Category</span>
        </v-card-title>

        <!-- Category Form -->
        <v-card-text class="px-4 pt-6">
          <v-text-field
            v-model="newCategory.name"
            label="Category Name"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-tag"
            clearable
            class="mb-4"
          />
        </v-card-text>

        <!-- Action Buttons -->
        <v-card-actions class="px-4 pb-4">
          <v-spacer />
          <v-btn
            variant="text"
            color="grey-darken-2"
            class="text-white"
            @click="openCategoryDialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="cyan-darken-1"
            variant="elevated"
            class="text-white"
            @click="onCreateCategory"
          >
            Save
          </v-btn>
        </v-card-actions>

        <!-- Search Toolbar -->
        <v-toolbar
          flat
          class="bg-cyan-lighten-5 px-4 pt-2"
          density="comfortable"
        >
          <v-text-field
            v-model="searchCategory"
            label="Search Categories"
            variant="solo-filled"
            density="comfortable"
            prepend-inner-icon="mdi-magnify"
            clearable
            class="flex-grow-1"
          />
        </v-toolbar>

        <!-- Category Table -->
        <v-data-table
          :headers="localHCategory"
          :items="categories"
          v-model:search="searchCategory"
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
              variant="text"
              color="red-darken-2"
              @click="deactivateItem(item)"
            >
              <v-icon size="18">mdi-radioactive</v-icon>
            </v-btn>
          </template>
        </v-data-table>
        
      </v-card>
    </v-dialog>

    <!-- Deactivate Master Item Dialog -->
    <v-dialog v-model="dialogDeactivate" max-width="460px" persistent>
      <v-card class="rounded-xl elevation-12">
        
        <!-- Header -->
        <v-card-title class="bg-cyan-darken-2 text-white text-h6 text-center py-4">
          <v-icon class="mb-1" size="24">mdi-alert-circle-outline</v-icon><br>
          Change Item Status?
        </v-card-title>

        <!-- Optional Confirmation Message -->
        <v-card-text class="text-center text-body-2 pt-2">
          Are you sure you want to deactivate this item?
          <br />
          This action can be undone later.
        </v-card-text>

        <!-- Action Buttons -->
        <v-card-actions class="justify-center py-4">
          <v-btn
            color="grey-darken-2"
            variant="text"
            class="text-white px-4"
            @click="close"
          >
            <v-icon class="mr-1">mdi-cancel</v-icon>
            Cancel
          </v-btn>

          <v-btn
            color="red-darken-2"
            variant="elevated"
            class="text-white px-4"
            @click="onDeactivated"
          >
            <v-icon class="mr-1">mdi-check-decagram</v-icon>
            Confirm
          </v-btn>
        </v-card-actions>
        
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup lang="ts">
import ErrorSnackbar from '@/components/globalcomponent/ErrorSnackbar.vue';
import { ref, reactive, computed, onMounted, } from 'vue';
import { useStore } from 'vuex';
import { 
  LOAD_CATEGORY_ITEM, 
  LOAD_MASTER_ITEM, 
  CREATE_ITEM, 
  DEACTIVATE_ITEM, 
  CREATE_CATEGORY_ITEM, 
} from '@/store/storeconstant';

import type { CategoryItem, MasterItem, Field } from '@/types/masteritem'; // ✅ type-only
import { headers, headerscategory } from '@/types/masteritem';         // ✅ runtime value

const store = useStore();

const search = ref<string>('');
const searchCategory = ref<string>('');
const openCreateDialog = ref<boolean>(false);
const openCategoryDialog = ref<boolean>(false);
const dialogDeactivate = ref<boolean>(false);


const error = ref<string | string[]>('');
const showError = ref<boolean>(false);

const editedIndex = ref(-1);

const mItems = computed<MasterItem[]>(() => store.state.masteritem.mItems);
const categories = computed<MasterItem[]>(() => store.state.masteritem.categories);
const hasSaved = computed<boolean>(() => store.state.masteritem.hasSaved);
const loading = computed<boolean>(() => store.state.masteritem.loading);

const formIcon = computed<string>(() => editedIndex.value === -1 ? 'mdi-new-box' : 'mdi-update');
const formTitle = computed<string>(() => editedIndex.value === -1 ? 'Create Customer' : 'Edit Customer');

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