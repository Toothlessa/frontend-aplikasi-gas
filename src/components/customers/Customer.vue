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
      :headers="headerCustomer"
      :items="customers"
      :search="search"
      :loading="loading"
      :loadingDetailCustomer="loadingDetailKey"
      :loadingDeactivateCustomer="loadingDeactivateKey"
      @edit="editItem"
      @deactivate="deactiveCustomer"
    />

    <!-- Error & Success Snackbars -->
    <SnackbarError :messages="validationErrorMessages" v-model="validationShowError" :timeout="2000" />
    <SnackbarSuccess v-model="hasSaved" message="Action completed successfully!" :timeout="2000" />

    <!-- Create/Edit Customer Dialog -->
    <DialogCustomerForm
      :dialog="DialogOpenCreate"
      :is-edit="isEditMode"
      :edited-item="editedItem"
      :all-fields="allFields"
      :loading-button-create="loadingButtonCreate"
      :loading-button-cancel="loadingButtonCancel"
      @close="DialogClose"
      @submit="onCreateCustomer"
      @update="onUpdateCustomer"
    />

    <!-- Deactivate Confirmation Dialog -->
    <DialogDeactivate
      :dialog="DialogOpenDeactive"
      :loading="loading"
      :loading-button-cancel="loadingButtonCancel"
      title="Confirm Status Change"
      message="Are you sure you want to change this customer's status?"
      @confirm="onDeactivateCustomer"
      @cancel="DialogClose"
    />

    <!-- Upload Customer Dialog -->
    <DialogUploadCustomer
      v-model:csvFile="csvFile"
      :dialog="DialogOpenUploadCustomer"
      :loading="uploading"
      :loading-button-cancel="loadingButtonCancel"
      @confirm="onUploadCustomer"
      @close="DialogClose"
    />

  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { Customer } from '@/types/Customer';
import { SnackbarError, SnackbarSuccess, ToolbarSimple } from '@/components/globalComponent';
import TableCustomer from './TableCustomer.vue';
import DialogCustomerForm from './DialogCustomerForm.vue';
import DialogDeactivate from './DialogDeactivate.vue';
import DialogUploadCustomer from './DialogUploadCustomer.vue';
import { useCustomer } from '@/composables/useCustomer';
import { useGlobal } from '@/composables/useGlobal';

  /* -----------------------------------------------------*
   * COMPOSABLES                                          *
   * ---------------------------------------------------- */

const {
  validationError,
  validationShowError,
  validationErrorMessages,
} = useGlobal();

const {
  DialogOpenCreate,
    DialogOpenDeactive,
    DialogOpenUploadCustomer,
    DialogCreateCustomer,
    DialogClose,

    search,

    editedItem,
    editedIndex,
    csvFile,
    uploading,

    headerCustomer,

    allFields,
    customers,

    loading,
    loadingButtonCreate,
    loadingButtonCancel,
    loadingDetailKey,
    loadingDeactivateKey,

    hasSaved,
    isEditMode,

    createCustomer,
    updateCustomer,
    loadCustomerData,

    deactivateCustomer,
    uploadCustomer,
} = useCustomer();

  /* -----------------------------------------------------*
   * HOOKS & LIFECYCLE                                    *
   * ---------------------------------------------------- */
onMounted(() => {
  onLoadCustomerData();
});

  /* -----------------------------------------------------*
   * METHODS                                              *
   * ---------------------------------------------------- */
  const editItem = (item: Customer) => {
    loadingDetailKey.value = `${item.id}`;
    setTimeout(() => {
      loadingDetailKey.value = null;
    }, 400);
    editedIndex.value = customers.value.indexOf(item);
    Object.assign(editedItem, item);
    DialogOpenCreate.value = true;
  };

  const onCreateCustomer = async(item: Partial<Customer>) => {
    try {
      Object.assign(editedItem, item);
      await createCustomer();
      DialogClose();
    } catch (e) {
      validationError(e);
    }
  };

  const onUpdateCustomer = async(item: Partial<Customer>) => {
    try {
      Object.assign(editedItem, item);
      await updateCustomer();
      DialogClose();
    } catch (e) {
      validationError(e);
    }
  };

  const onLoadCustomerData = async() => {
    try {
      await loadCustomerData();
    } catch (e) {
      validationError(e);
    }
  };

  const deactiveCustomer = (item: Customer) => {
    loadingDeactivateKey.value = `${item.id}`;
    setTimeout(() => {
      loadingDeactivateKey.value = null;
    }, 400);
    Object.assign(editedItem, item);
    DialogOpenDeactive.value = true;
  };

  const onDeactivateCustomer = async() => {
    try {
      await deactivateCustomer();
      DialogClose();
    } catch (e) {
      validationError(e);
    }
  };

  const onUploadCustomer = async() => {
    try{
      if(!csvFile.value){
        validationError('Please select a CSV file to upload.');
        return;
      }
      await uploadCustomer();
      DialogClose();
    } catch (e) {
      validationError(e);
    }
  };

</script>

<style scoped>
.bg-gradient-to-r {
  background: linear-gradient(to right, var(--v-theme-from), var(--v-theme-to));
}
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}
</style>
