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
        @click="openCreateDialog = true, editedItem = {}, error = '', editedIndex = -1;"
      >
          <v-icon>mdi-new-box</v-icon>
      </v-btn>

      <v-btn
        style="color: white;" 
        rounded="xl" 
        icon
        @click="dialogUploadCustomer = true, this.error = ''"
      >
        <v-icon>mdi-cloud-upload</v-icon>
      </v-btn>

      <v-spacer />

      <v-text-field
        v-model="search"
        label="Search by customer name"
        variant="solo-filled"
        class="mr-4"
        style="max-width: 500px;"
        density="compact"
        prepend-inner-icon="mdi-magnify"
        flat
      />
    </v-toolbar>

    <v-snackbar 
      v-model="hasSaved" 
      :timeout="2000" 
      location="center"
    >
      Data have been saved
    </v-snackbar>

    <ItemFormDialog
      :dialog="openCreateDialog"
      :editedItem="editedItem"
      :autocompleteFields="autocompleteFields"
      :numericFields="numericFields"
      :error="error"
      :alert="alert"
      :dialogCategory="dialogCategory"
      @close="close"
      @save="save"
    />

    <!-- <ConfirmDialog
      :dialog="dialogUpdateItem"
      title="Are you sure to change the status of this item?"
      icon="mdi-pokeball"
      @onCancel="closeUpdateStatus"
      @onConfirm="updateStatusItem"
    />

    <CategoryDialog
      :dialog="dialogCategory"
      :alert="alert"
      :error="error"
      :categoryData="categoryData"
      :categoryHeaders="categoryHeaders"
      :categoryItems="categoryItems"
      :createCategory="createCategory"
      :editCategories="editCategories"
      :updateStatusCategory="updateStatusCategory"
    />

    <ConfirmDialog
      :dialog="dialogInactive"
      title="Change the status of this category?"
      icon="mdi-check"
      @onCancel="() => dialogInactive = false"
      @onConfirm="updateStatusCategoryConfirm"
    /> -->

    <v-data-table
      :headers="headers"
      :items="mItems"
      class="bg-cyan-lighten-5 text-black"
      v-model:search="search"
      :filter-keys="['item_name']"
      :loading="loading"
      loading-text="Loading... Please wait"
      color
    >
      <template v-slot:[`item.in_stock`]="{ item }">
        <v-chip :color="item.in_stock ? 'green' : 'red'" :text="item.in_stock ? 'In stock' : 'Out of stock'" class="text-uppercase" size="small" label />
      </template>
      <template v-slot:[`item.active_flag`]="{ item }">
        <v-chip :color="item.active_flag ? 'green' : 'black'" :text="item.active_flag ? 'Active' : 'Inactive'" class="text-uppercase" size="small" label />
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon size="small" class="me-2" @click="editItem(item)">mdi-pencil-outline</v-icon>
        <v-icon size="small" @click="updateItem(item)">mdi-radioactive</v-icon>
      </template>
    </v-data-table>
</v-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import ItemFormDialog from './ItemFormDialog.vue';
import { LOAD_MASTER_ITEM } from '@/store/storeconstant';
// import ConfirmDialog from './ConfirmDialog.vue';
// import CategoryDialog from './CategoryDialog.vue';

const store = useStore();

const search = ref('');
const hasSaved = computed(() => store.state.masteritem.hasSaved);
const openCreateDialog = ref(false);
// const dialogCategory = ref(false);
// const dialogUpdateItem = ref(false);
// const dialogDeactivate = ref(false);
// const dialogUploadCustomer = ref(false);
// const dialogInactive = ref(false);
const error = ref('');
// const alert = ref(false);
// const showError = ref(false);
// const csvFile = ref(null);
// const uploading = ref(false);

const editedItem = reactive({
  item_name: '',
  item_type: '',
  category_id: '',
  cost_of_goods_sold: '',
  selling_price: ''
});

const editedIndex = ref(-1);

// const categoryItems = ref([]);
// const categoryData = reactive({ name: '' });
// const categoryHeaders = [
//   { title: 'No', key: 'number' },
//   { title: 'Name', key: 'name' },
//   { title: 'Status', key: 'active_flag' },
//   { title: 'Actions', key: 'actions', sortable: false }
// ];

const headers = [
  { title: 'Item Name', align: 'start', key: 'item_name' },
  { title: 'Item Code', align: 'start', key: 'item_code' },
  { title: 'Item Type', align: 'start', key: 'item_type' },
  { title: 'Category', align: 'start', key: 'category' },
  { title: 'Cost of Goods', align: 'start', key: 'cost_of_goods_sold', value: item => formatPrice(item.cost_of_goods_sold) },
  { title: 'Selling Price', align: 'center', key: 'selling_price', value: item => formatPrice(item.selling_price) },
  { title: 'Stock', align: 'center', key: 'in_stock'},
  { title: 'Status', align: 'center', key: 'active_flag'},
  { title: 'Actions', key: 'actions', sortable: false },
];

// const autocompleteFields = [
//   {
//     label: 'Item Type',
//     model: 'item_type',
//     items: ref([]),
//     itemTitle: 'name',
//     itemValue: 'name'
//   },
//   {
//     label: 'Category',
//     model: 'category_id',
//     items: categoryItems,
//     itemTitle: 'name',
//     itemValue: 'id'
//   }
// ];

// const numericFields = [
//   { label: 'Cost of Goods', model: 'cost_of_goods_sold', enterSave: false },
//   { label: 'Selling Price', model: 'selling_price', enterSave: true }
// ];

onMounted(() => {
  loadMasterItem();
});

const loadMasterItem = () => store.dispatch(`masteritem/${LOAD_MASTER_ITEM}`);
const mItems = computed(() => store.state.masteritem.mItems);
const loading = computed(() => store.state.masteritem.loading);

function formatPrice(value) {
  return `Rp${parseFloat(value).toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$&.')}`;
}

// function editItem(item) {
//   editedIndex.value = mItems.value.indexOf(item);
//   Object.assign(editedItem, item);
//   openCreateDialog.value = true;
// }

// function close() {
//   openCreateDialog.value = false;
//   dialogDeactivate.value = false;
//   Object.assign(editedItem, {});
//   editedIndex.value = -1;
// }

// function updateStatusItem() {
//   store.dispatch('masteritem/DEACTIVATE_CUSTOMER', editedItem.id);
//   dialogUpdateItem.value = false;
// }

// async function save() {
//   try {
//     error.value = '';
//     await store.dispatch('masteritem/CREATE_CUSTOMER', editedItem);
//     openCreateDialog.value = false;
//   } catch (e) {
//     showError.value = true;
//     error.value = e;
//   }
// }

// async function onUploadCustomer() {
//   if (!csvFile.value) {
//     showError.value = true;
//     error.value = ['Please select a CSV file to upload.'];
//     return;
//   }
//   uploading.value = true;
//   try {
//     await store.dispatch('masteritem/UPLOAD_CUSTOMER', csvFile.value);
//     dialogUploadCustomer.value = false;
//     csvFile.value = null;
//   } catch (e) {
//     showError.value = true;
//     error.value = Array.isArray(e) ? e : [e];
//   } finally {
//     uploading.value = false;
//   }
// }

// function updateStatusCategoryConfirm() {
//   dialogInactive.value = false;
//   // Implement status update logic here if needed
// }

// function createCategory() {
//   // Add logic to create category
// }

// function editCategories(item) {
//   // Add logic to edit category
// }

// function updateStatusCategory(item) {
//   // Add logic to update category status
// }
</script>
