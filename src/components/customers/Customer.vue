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
import { onMounted } from 'vue';
import { Customer } from '@/types/Customer';
import { SnackbarError, SnackbarSuccess, ToolbarSimple } from '@/components/globalComponent';
import TableCustomer from './TableCustomer.vue';
import DialogCustomerForm from './DialogCustomerForm.vue';
import DialogDeactivate from './DialogDeactivate.vue';
import DialogUploadCustomer from './DialogUploadCustomer.vue';
import { useCustomer } from '@/composables/useCustomer';


const {
  DialogOpenCreate,
    DialogOpenDeactive,
    DialogOpenUploadCustomer,
    DialogCreateCustomer,
    DialogClose,

    search,

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

    editItem,
    onSubmit,
    onUpdate,
    deactivateCustomer,
    onDeactivated,
    onUploadCustomer,
    showError,
    errorMessages,
} = useCustomer();

//mounted
onMounted(loadCustomerData);

</script>

<style scoped>
.bg-gradient-to-r {
  background: linear-gradient(to right, var(--v-theme-from), var(--v-theme-to));
}
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}
</style>
