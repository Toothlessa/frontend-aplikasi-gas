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
      @create="DialogCreateCustomer"
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
      @close="DialogClose"
      @submit="onSubmit"
      @update="onUpdate"
    />

    <!-- Deactivate Confirmation Dialog -->
    <DialogDeactivate
      :dialog="DialogOpenDeactive"
      title="Confirm Status Change"
      message="Are you sure you want to change this customer's status?"
      @confirm="onDeactivated"
      @cancel="DialogClose"
    />

    <!-- Upload Customer Dialog -->
    <DialogUploadCustomer
      v-model:csvFile="csvFile"
      :dialog="DialogOpenUploadCustomer"
      :loading="uploading"
      @confirm="onUploadCustomer"
      @close="DialogClose"
    />

  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import store from '@/store/store';
import { 
  CREATE_CUSTOMER, 
  DEACTIVATE_CUSTOMER, 
  UPDATE_CUSTOMER, 
  UPLOAD_CUSTOMER 
} from '@/store/storeconstant';
import { Customer, CustomerField, headerCustomer } from '@/types/Customer';
import { SnackbarError, SnackbarSuccess, ToolbarSimple } from '@/components/globalComponent';
import TableCustomer from './TableCustomer.vue';
import DialogCustomerForm from './DialogCustomerForm.vue';
import DialogDeactivate from './DialogDeactivate.vue';
import DialogUploadCustomer from './DialogUploadCustomer.vue';
import { useCustomer } from '@/composables/useCustomer';


const {
    search,
    
    editedIndex,
    editedItem,
    
    csvFile,
    uploading,

    headersLocal,
    
    allFields,
    customers,
    loading,
    hasSaved,
    isEditMode,

    loadCustomerData,
    resetEditedItem,
    handleError,

    error,
    showError,
    errorMessages,
} = useCustomer();

// Dialogs
const DialogOpenCreate = ref(false);
const DialogOpenDeactive = ref(false);
const DialogOpenUploadCustomer = ref(false);
const DialogCreateCustomer = () => {
  resetEditedItem();
  error.value = '';
  DialogOpenCreate.value = true;
};
const DialogClose = () => {
  DialogOpenCreate.value = false;
  DialogOpenDeactive.value = false;
  DialogOpenUploadCustomer.value = false;
};

//mounted
onMounted(loadCustomerData);

//const methods
const editItem = (item: Customer) => {
  editedIndex.value = customers.value.indexOf(item);
  Object.assign(editedItem, item);
  error.value = '';
  DialogOpenCreate.value = true;
};

const onSubmit = (item: Partial<Customer>) => {
  Object.assign(editedItem, item);
  onCreateItem();
};

const onUpdate = (item: Partial<Customer>) => {
  Object.assign(editedItem, item);
  onUpdateCustomer();
}

const deactivateCustomer = (item: Customer) => {
  Object.assign(editedItem, item);
  DialogOpenDeactive.value = true;
};

async function onCreateItem() {
  error.value = '';
  try {
    await store.dispatch(`customer/${CREATE_CUSTOMER}`, editedItem);
    DialogClose();
  } catch (e) {
    handleError(e);
  }
}

async function onUpdateCustomer() {
  try {
    await store.dispatch(`customer/${UPDATE_CUSTOMER}`,editedItem);
    DialogClose();
  } catch (e) {
    handleError(e);
  }
}

async function onDeactivated() {
  try {
    error.value = '';
    await store.dispatch(`customer/${DEACTIVATE_CUSTOMER}`, editedItem.id);
    DialogClose();
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
    DialogClose();
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
