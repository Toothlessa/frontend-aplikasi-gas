<template>
  <v-container fluid class="pa-4 rounded-xl elevation-12">
    <ToolbarSimple
      title="Customer Management"
      icon="mdi-account-group-outline"
      color="blue"
      :search="search"
      :show-upload-button="true"
      @update:search="search = $event"
      @upload-customer="DialogOpenUploadCustomer = true"
      @create="openCreateDialog"
    />

    <!-- Master Customer Table -->
    <TableCustomer
      :headers="headersLocal"
      :items="customers"
      :search="search"
      :loading="loading"
      @edit="editItem"
      @deactivate="deactivateCustomer"
    />

    <!-- Error & Success Snackbars -->
    <SnackbarError :messages="errorMessages" v-model="showError" :timeout="5000" />
    <SnackbarSuccess v-model="hasSaved" message="Action completed successfully!" />

    <!-- Create/Edit Customer Dialog -->
    <DialogCustomerForm
      :dialog="DialogOpenCreate"
      :is-edit="isEditMode"
      :edited-item="editedItem"
      :all-fields="allFields"
      @close="closeDialogs"
      @submit="onSubmit"
    />

    <!-- Deactivate Confirmation Dialog -->
    <DialogDeactivate
      :dialog="DialogOpenDeactive"
      title="Confirm Status Change"
      message="Are you sure you want to change this customer's status?"
      @confirm="onDeactivated"
      @cancel="closeDialogs"
    />

    <!-- Upload Customer Dialog -->
    <DialogUploadCustomer
      v-model:csvFile="csvFile"
      :dialog="DialogOpenUploadCustomer"
      :loading="uploading"
      @confirm="onUploadCustomer"
      @close="closeDialogs"
    />

  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import store from '@/store/store';
import { 
  CREATE_CUSTOMER, 
  DEACTIVATE_CUSTOMER, 
  LOAD_CUSTOMER_DATA, 
  SET_HASSAVED, 
  UPDATE_CUSTOMER, 
  UPLOAD_CUSTOMER 
} from '@/store/storeconstant';
import { Customer, CustomerField, headerCustomer } from '@/types/Customer';
import { SnackbarError, SnackbarSuccess, ToolbarSimple } from '@/components/globalComponent';
import TableCustomer from './TableCustomer.vue';
import DialogCustomerForm from './DialogCustomerForm.vue';
import DialogDeactivate from './DialogDeactivate.vue';
import DialogUploadCustomer from './DialogUploadCustomer.vue';

// State
const search = ref('');
const editedIndex = ref(-1);
const editedItem = reactive<Partial<Customer>>({});
const defaultItem: Partial<Customer> = {
  id: 0,
  customer_name: '',
  customer_type: '',
  nik: '',
  email: '',
  address: '',
  phone: '',
  active_flag: false,
};
const csvFile = ref<File | null>(null);
const uploading = ref(false);
const error = ref<string | string[]>('');
const showError = ref(false);

// Dialogs
const DialogOpenCreate = ref(false);
const DialogOpenDeactive = ref(false);
const DialogOpenUploadCustomer = ref(false);

// Computed Properties
const customers = computed(() => store.state.customer.customers);
const loading = computed(() => store.state.customer.loading);
const hasSaved = computed({
  get: () => store.state.customer.hasSaved,
  set: (val: boolean) => store.commit(`customer/${SET_HASSAVED}`, val),
});
const isEditMode = computed(() => editedIndex.value !== -1);
const errorMessages = computed(() => Array.isArray(error.value) ? error.value : [error.value]);

const allFields = computed<CustomerField[]>(() => [
  { model: 'customer_name', label: 'Customer Name' },
  { model: 'customer_type', label: 'Type' },
  { model: 'nik', label: 'NIK' },
  { model: 'email', label: 'E-Mail', onEnterSubmit: true },
  { model: 'address', label: 'Address', onEnterSubmit: true },
  { model: 'phone', label: 'Phone', onEnterSubmit: true },
]);

const headersLocal = headerCustomer;

// Methods
const loadCustomerData = () => store.dispatch(`customer/${LOAD_CUSTOMER_DATA}`);

onMounted(loadCustomerData);

const resetEditedItem = () => {
  Object.assign(editedItem, defaultItem);
  editedIndex.value = -1;
};

const openCreateDialog = () => {
  resetEditedItem();
  error.value = '';
  DialogOpenCreate.value = true;
};

const editItem = (item: Customer) => {
  editedIndex.value = customers.value.indexOf(item);
  Object.assign(editedItem, item);
  error.value = '';
  DialogOpenCreate.value = true;
};

const closeDialogs = () => {
  DialogOpenCreate.value = false;
  DialogOpenDeactive.value = false;
  DialogOpenUploadCustomer.value = false;
};

const handleError = (e: unknown) => {
  showError.value = true;
  if (Array.isArray(e)) {
    error.value = e;
  } else if (e instanceof Error) {
    error.value = e.message;
  } else {
    error.value = String(e);
  }
};

const onSubmit = (item: Partial<Customer>) => {
  Object.assign(editedItem, item);
  onCreateItem();
};

async function onCreateItem() {
  
  error.value = '';
  try {
    await store.dispatch(`customer/${CREATE_CUSTOMER}`, editedItem);
    closeDialogs();
  } catch (e) {
    handleError(e);
  }
}

async function onUpdateCustomer() {
  try {
    await store.dispatch(`customer/${UPDATE_CUSTOMER}`,editedItem);
    closeDialogs();
  } catch (e) {
    handleError(e);
  }
}

const deactivateCustomer = (item: Customer) => {
  Object.assign(editedItem, item);
  DialogOpenDeactive.value = true;
};

async function onDeactivated() {
  try {
    error.value = '';
    await store.dispatch(`customer/${DEACTIVATE_CUSTOMER}`, editedItem.id);
    closeDialogs();
  } catch (e) {
    handleError(e);
  }
}

async function onUploadCustomer() {
  if (!csvFile.value) {
    handleError('Please select a CSV file to upload.');
    return;
  }
  uploading.value = true;
  try {
    await store.dispatch(`customer/${UPLOAD_CUSTOMER}`, csvFile.value);
    closeDialogs();
    csvFile.value = null;
  } catch (e) {
    handleError(e);
  } finally {
    uploading.value = false;
  }
}
</script>

<style scoped>
.bg-gradient-to-r {
  background: linear-gradient(to right, var(--v-theme-from), var(--v-theme-to));
}
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}
</style>
