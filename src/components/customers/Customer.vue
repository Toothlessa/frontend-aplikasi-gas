<template>
    <v-container fluid class="pa-0">

    <!-- Toolbar Actions -->
     <ToolbarSimple
      title="Manage Customers"
      icon="mdi-new-box"
      :color="'bg-blue-accent-2'"
      :search="search"
      :showUploadButton="true"
      @update:search="search = $event"
      @upload-customer="DialogOpenUploadCustomer = true"
      @create="
        DialogOpenCreate = true;
        resetEditedItem();
        error = '';
        editedIndex = -1;
      "
    />

    <!-- Error Snackbar -->
     <SnackbarError :messages="Array.isArray(error) ? error : [error]" v-model="showError" :timeout="4000" />
     
    <!-- Success Snackbar -->
     <SnackbarSuccess v-model="hasSaved" message="Item has been saved successfully!" />

      <!-- Master Customer Table -->
     <TableCustomer
      :headers="headersLocal"
      :items="customers"
      :search="search"
      :loading="loading"
      :bgcolor="'bg-blue-lighten-4'"
      @edit="editItem"
      @submit="onCreateItem"
      @deactivate="deactivateCustomer"
    />

     <!-- Create/Edit Customer Dialog -->
    <DialogCustomerForm
      :dialog="DialogOpenCreate"
      :isEdit="editedIndex !== -1"
      :editedItem="editedItem"
      :allFields="allFields"
      @close="close"
      @submit="onSubmit"
    />

    <!-- Deactivate Dialog -->
   <DialogDeactivate
      :dialog="DialogOpenDeactive"
      title="Change Customer Status?"
      message="Are you sure you want to deactivate this customer?"
      @confirm="onDeactivated"
      @cancel="close"
    />

    <!-- Dialog Upload Customer -->
   <DialogUploadCustomer
      v-model:csvFile="csvFile"
      :dialog="DialogOpenUploadCustomer"
      :loading="uploading"
      @confirm="onUploadCustomer"
      @close="close"
    />
</v-container>
</template>

<script setup lang="ts">
import { SnackbarError, SnackbarSuccess, ToolbarSimple } from '@/components/globalComponent';
import TableCustomer from './TableCustomer.vue';
import DialogCustomerForm from './DialogCustomerForm.vue';
import DialogDeactivate from './DialogDeactivate.vue';
import DialogUploadCustomer from './DialogUploadCustomer.vue';

import { Customer, CustomerField, headerCustomer } from '@/types/Customer';

import store from '@/store/store';
import { computed, onMounted, reactive, ref } from 'vue';
import { 
  CREATE_CUSTOMER,
  DEACTIVATE_CUSTOMER,
  LOAD_CUSTOMER_DATA,
  SET_HASSAVED,
  UPLOAD_CUSTOMER,
} from '@/store/storeconstant';

//Variable
const headersLocal = headerCustomer; // Use the imported headers directly
const search = ref<string>('');
const editedIndex = ref(-1);
const editedItem = reactive<Partial<Customer>>({});
const defaultItem: Partial<Customer> = {
  id: '',
  customer_name: '',
  type: '',
  nik: '',
  email: '',
  address: '',
  phone: '',
  active_flag: false,
};

const hasSaved = computed({
  get: () => store.state.customer.hasSaved,
  set: (val: boolean) => {
    store.commit(`Customer/${SET_HASSAVED}`, val);
  },
});
const csvFile = ref<File | null>(null);
const uploading = ref(false);
const error = ref<string | string[]>('');
const showError = ref<boolean>(false);

//DIalog
const DialogOpenCreate = ref<boolean>(false);
const DialogOpenDeactive = ref<boolean>(false);
const DialogOpenUploadCustomer = ref<boolean>(false);

const allFields = computed<CustomerField[]>(() => [
  { model: 'customer_name', label: 'Customer Name' },
  { model: 'type', label: 'Type'  },
  { model: 'nik', label: 'NIK' },
  { model: 'email', label: 'E-Mail',  onEnterSubmit: true },
  { model: 'address', label: 'Address',  onEnterSubmit: true },
  { model: 'phone', label: 'Phone',  onEnterSubmit: true },
]);

//computed
const customers = computed<Customer[]>(() => store.state.customer.customers);
const loading = computed<boolean>(() => store.state.customer.loading);

const loadCustomerData = () => store.dispatch(`customer/${LOAD_CUSTOMER_DATA}`);

onMounted(() => {
  loadCustomerData();
});

function editItem(item:any) {
  editedIndex.value = customers.value.indexOf(item);
  Object.assign(editedItem, item);
  DialogOpenCreate.value = true;
}

function close() {
  DialogOpenCreate.value = false;
  DialogOpenDeactive.value = false;
  DialogOpenUploadCustomer.value = false;
  editedIndex.value = -1;
}

function resetEditedItem() {
// Reset field edit and update item
Object.assign(editedItem, defaultItem);
}

function onSubmit(item: Partial<Customer>) {
  Object.assign(editedItem, item); 
  console.log('Submitted item:', item);
  onCreateItem(); 
}

async function onCreateItem() {
  try {
    error.value = '';
    console.log('Creating item:', editedItem);

    await store.dispatch(`customer/${CREATE_CUSTOMER}`, editedItem);
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

function deactivateCustomer(item:any) {
  Object.assign(editedItem, item);
  DialogOpenDeactive.value = true;
}

async function onDeactivated() {
  try {
    error.value = '';

    await store.dispatch(`customer/${DEACTIVATE_CUSTOMER}`, editedItem.id);
    DialogOpenDeactive.value = false;
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

// Upload handler
async function onUploadCustomer() {
  if (!csvFile.value) {
    showError.value = true;
    error.value = ['Please select a CSV file to upload.'];
    return;
  }
  console.log("csv file:", csvFile.value);
  uploading.value = true;

  try {
    await store.dispatch(`customer/${UPLOAD_CUSTOMER}`, csvFile.value);
    DialogOpenUploadCustomer.value = false;
    csvFile.value = null;
  } catch (e: unknown) {
    showError.value = true;
    if (Array.isArray(e)) {
      error.value = e;
    } else if (typeof e === 'string') {
      error.value = [e];
    } else if (e instanceof Error) {
      error.value = [e.message];
    } else {
      error.value = ['An unknown error occurred.'];
    }
  } finally {
    uploading.value = false;
  }

}
</script>