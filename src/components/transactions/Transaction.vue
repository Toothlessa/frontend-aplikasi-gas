<template>
  <div :class="theme.global.current.value.dark ? 'modern-layout-dark' : 'modern-layout-light'">
    <v-container fluid>
      <!-- Header -->
      <v-sheet
        class="page-header"
        elevation="4"
        rounded="xl"
        :class="theme.global.current.value.dark ? 'page-header-dark' : 'page-header-light'"
      >
        <v-row align="center" class="pa-2">
          <v-col cols="auto">
            <v-avatar color="white" size="48">
              <v-icon icon="mdi-swap-horizontal-bold" color="cyan-darken-2" size="40" />
            </v-avatar>
          </v-col>
          <v-col>
            <h1 :class="theme.global.current.value.dark ? 'text-h6 font-weight-bold text-white' : 'text-h6 font-weight-bold text-white'">
              Transactions
            </h1>
            <p :class="theme.global.current.value.dark ? 'text-body-2 text-white mt-1' : 'text-body-2 text-white mt-1'" style="opacity: 0.9;">
              Manage and track all your financial transactions
            </p>
          </v-col>
        </v-row>
      </v-sheet>

      <v-row class="mt-8">
        <!-- Left Column: Input Form -->
        <v-col cols="12" md="3">
          <v-card class="form-card rounded-xl elevation-2" :class="theme.global.current.value.dark ? 'form-card-dark' : 'form-card-light'">
            <v-card-title :class="theme.global.current.value.dark ? 'card-header-dark' : 'card-header-light'">
              <v-icon start>mdi-cash-register</v-icon>
              New Transaction
            </v-card-title>
            <v-card-text class="pa-5">
              <v-alert
                v-if="error"
                v-model="alert"
                type="error"
                variant="tonal"
                closable
                class="mb-4"
              >
                {{ error }}
              </v-alert>

              <v-autocomplete
                label="Customer"
                v-model="transactionData.customer_id"
                variant="outlined"
                rounded="lg"
                :items="customers"
                :disabled="!fieldDisabled"
                item-title="customer_name"
                item-value="id"
                prepend-inner-icon="mdi-account-search-outline"
                class="mb-4"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :subtitle="item.raw.nik"
                    :title="item.raw.customer_name"
                  />
                </template>
              </v-autocomplete>

              <v-number-input
                label="Quantity"
                v-model="transactionData.quantity"
                :disabled="!fieldDisabled"
                variant="outlined"
                rounded="lg"
                controlVariant="split"
                prepend-inner-icon="mdi-counter"
                @keyup.enter="save"
                class="mb-4"
              />

              <v-textarea
                label="Description"
                v-model="transactionData.description"
                variant="outlined"
                rounded="lg"
                rows="2"
                :disabled="!fieldDisabled"
                prepend-inner-icon="mdi-note-text-outline"
                class="mb-4"
                @keyup.enter="save"
              />

              <v-autocomplete
                v-model="transactionData.amount"
                variant="outlined"
                rounded="lg"
                :items="price"
                item-title="name"
                item-value="value"
                :label="`Price`"
                :hint="!isEditAmt ? 'Click lock to edit' : 'Click lock to save'"
                :readonly="!isEditAmt"
                :disabled="!fieldDisabled"
                persistent-hint
                prepend-inner-icon="mdi-currency-usd"
              >
                <template v-slot:append>
                  <v-icon
                    :color="isEditAmt ? 'error' : 'success'"
                    :icon="isEditAmt ? 'mdi-lock-open-variant-outline' : 'mdi-lock-outline'"
                    @click="isEditAmt = !isEditAmt"
                  />
                </template>
              </v-autocomplete>

              <v-checkbox
                label="Delivery Service"
                v-model="isSend"
                color="cyan-darken-2"
                @click="checkIsSend"
                :disabled="!fieldDisabled"
                class="mt-2"
              />

              <v-btn
                block
                class="text-white mt-4"
                variant="elevated"
                size="large"
                rounded="xl"
                color="cyan-darken-1"
                :disabled="isSaveDisabled"
                :loading="loadingButtonSave"
                @click="save"
              >
                <v-icon left>mdi-content-save</v-icon>
                Save Transaction
              </v-btn>
            </v-card-text>
          </v-card>

          <v-card class="form-card mt-6" elevation="2" rounded="xl">
            <v-card-title :class="theme.global.current.value.dark ? 'card-header-dark' : 'card-header-light'">
              <v-icon start>mdi-package-variant-closed</v-icon>
              Select Item
            </v-card-title>
            <v-card-text class="pa-5">
              <v-autocomplete
                v-model="transactionData.item_id"
                :items="mItems"
                item-title="item_name"
                item-value="id"
                label="Item"
                :readonly="!isEditing"
                :hint="!isEditing ? 'Click lock to edit' : 'Click lock to save'"
                :disabled="!fieldDisabled"
                persistent-hint
                variant="filled"
                rounded="lg"
                prepend-inner-icon="mdi-cube-outline"
              >
                <template v-slot:append>
                   <v-icon
                    :color="isEditing ? 'error' : 'success'"
                    :icon="isEditing ? 'mdi-lock-open-variant-outline' : 'mdi-lock-outline'"
                    @click="isEditing = !isEditing"
                  />
                </template>
              </v-autocomplete>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column: Data Table -->
        <v-col cols="12" md="8">
          <v-card class="list-card" elevation="2" rounded="xl">
            <v-card-title :class="theme.global.current.value.dark ? 'card-header-dark' : 'card-header-light'" class="d-flex align-center">
              <v-icon start>mdi-format-list-bulleted</v-icon>
              Transaction History
              <v-spacer />
              <div class="d-flex align-center">
                <v-btn color="white" variant="tonal" @click="DialogDate = true" class="mr-3">
                  <v-icon start>mdi-calendar</v-icon>
                  {{ dateTitle }}
                </v-btn>
                <v-text-field
                  v-model="search"
                  density="compact"
                  label="Search"
                  prepend-inner-icon="mdi-magnify"
                  variant="solo-filled"
                  flat
                  hide-details
                  rounded="xl"
                  class="search-field"
                  width="300"
                />
              </div>
            </v-card-title>
            <v-divider />
            <v-data-table-virtual
              class="modern-table"
              v-model:search="search"
              :headers="headersLocal"
              :items="transactions"
              :loading="loading"
              loading-text="Loading data..."
              hover
            >
              <template v-slot:[`item.description`]="{ value }">
                <v-chip :color="getColorByDescription(value)" size="small" class="font-weight-bold">
                  {{ value }}
                </v-chip>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn icon="mdi-pencil-outline" variant="text" color="blue-grey" @click="editTransaction(item)" />
              </template>
              <template v-slot:[`item.amount`]="{ item }">
                {{ formatPrice(item.amount) }}
              </template>
              <template v-slot:[`item.total`]="{ item }">
                {{ formatPrice(item.total) }}
              </template>
            </v-data-table-virtual>
          </v-card>
        </v-col>
      </v-row>
      
      <v-dialog v-model="DialogUpdate" max-width="600px" persistent>
        <v-card rounded="xl">
          <v-card-title :class="theme.global.current.value.dark ? 'dialog-header-dark' : 'dialog-header-light'">
            <v-icon start>mdi-update</v-icon>
            Update Transaction
          </v-card-title>
          <v-card-text class="pa-5">
             <v-autocomplete
                label="Customer"
                v-model="transactionUpdate.customer_id"
                variant="filled"
                rounded="lg"
                :items="customers"
                item-title="customer_name"
                item-value="id"
                prepend-inner-icon="mdi-account-search-outline"
                class="mb-4"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :subtitle="item.raw.nik"
                    :title="item.raw.customer_name"
                  />
                </template>
              </v-autocomplete>

              <v-number-input
                label="Quantity"
                v-model="transactionUpdate.quantity"
                variant="filled"
                rounded="lg"
                controlVariant="split"
                prepend-inner-icon="mdi-counter"
                class="mb-4"
              />

              <v-textarea
                label="Description"
                v-model="transactionUpdate.description"
                variant="filled"
                rounded="lg"
                rows="2"
                prepend-inner-icon="mdi-note-text-outline"
                class="mb-4"
              />

              <v-autocomplete
                v-model="transactionUpdate.amount"
                variant="filled"
                rounded="lg"
                :items="price"
                item-title="name"
                item-value="value"
                label="Price"
                hint="Click lock to edit"
                :readonly="!isEditAmt"
                persistent-hint
                prepend-inner-icon="mdi-currency-usd"
              >
                <template v-slot:append>
                  <v-icon
                    :color="isEditAmt ? 'error' : 'success'"
                    :icon="isEditAmt ? 'mdi-lock-open-variant-outline' : 'mdi-lock-outline'"
                    @click="isEditAmt = !isEditAmt"
                  />
                </template>
              </v-autocomplete>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer />
            <v-btn @click="close" rounded="lg">Cancel</v-btn>
            <v-btn
              color="cyan-darken-1"
              class="text-white"
              :disabled="isUpdateDisabled"
              :loading="loadingButtonUpdate"
              @click="save"
              rounded="lg"
            >
              <v-icon left>mdi-content-save-edit</v-icon>
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="DialogDate" max-width="400px" persistent>
        <v-card rounded="xl">
          <v-card-title :class="theme.global.current.value.dark ? 'dialog-header-dark' : 'dialog-header-light'">
            <v-icon start>mdi-calendar-search</v-icon>
            Select Date
          </v-card-title>
          <v-card-text class="pa-0">
            <v-date-picker
              v-model="pickDate"
              color="cyan-darken-2"
              @update:model-value="getTransactionByDate(); DialogDate = false"
              show-adjacent-months
              width="400"
            />
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-snackbar
        v-model="hasSaved"
        :timeout="2500"
        color="success"
        location="top right"
        rounded="xl"
        elevation="12"
      >
        <v-icon start>mdi-check-circle-outline</v-icon>
        Data has been saved successfully.
      </v-snackbar>
    </v-container>
  </div>
</template>
<script setup lang="ts">
import {  onMounted } from 'vue';
import { VNumberInput } from 'vuetify/lib/labs/components.mjs';
import { useTransaction } from '@/composables/useTransaction';
import { useCustomer } from '@/composables/useCustomer';
import { useMasterItem } from '@/composables/useMasterItem';
import { useGlobal } from '@/composables/useGlobal';

const {
  formatPrice,
} = useGlobal();

const {
  // theme
    theme,

    // state
    search,
    transactionData,
    transactionUpdate,
    DialogDate,
    DialogUpdate,
    isEditAmt,
    isEditing,
    isSend,
    hasSaved,
    loadingButtonSave,
    loadingButtonUpdate,
    fieldDisabled,
    alert,

    // headers
    headersLocal,

    // error
    error,

    // date filter
    dateTitle,
    pickDate,

    // static
    price,

    // computed
    transactions,
    loading,
    isSaveDisabled,
    isUpdateDisabled,

    // utility functions
    getColorByDescription,

    // actions
    save,
    editTransaction,
    close,
    checkIsSend,
    getTransactionByDate
} = useTransaction();

const {
  //computed
  customers,
  //function
  loadCustomerData,
  labels,
  totals,
  loadTopCustomerTransaction,
} = useCustomer();

const {
  mItems,
  loadMasterItemByType,
} = useMasterItem();

onMounted(() => {
  loadCustomerData();
  loadMasterItemByType('ITEM');
  getTransactionByDate();
  loadTopCustomerTransaction();
});
</script>

<style scoped>
.modern-layout-light {
  background-color: #f4f6f8;
  min-height: 100vh;
}

.modern-layout-dark {
  background-color: #282828;
  min-height: 100vh;
}

.page-header-light {
  background: linear-gradient(45deg, #00BCD4 0%, #4DD0E1 100%);
  color: white;
}

.page-header-dark {
  background: linear-gradient(45deg, #00838F 0%, #00ACC1 100%);
  color: white;
}

.form-card-light, .list-card, .v-dialog .v-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  transition: box-shadow 0.3s ease-in-out;
}

.form-card-dark {
  background-color: #333333;
  border: 1px solid #444444;
  transition: box-shadow 0.3s ease-in-out;
}

.form-card-light:hover, .list-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
}

.form-card-dark:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
}

.card-header-light {
  background-color: #00BCD4 !important;
  color: white !important;
  font-size: 1.2rem;
  font-weight: 600;
}

.card-header-dark {
  background-color: #00838F !important;
  color: white !important;
  font-size: 1.2rem;
  font-weight: 600;
}

.dialog-header-light {
  background-color: #00BCD4 !important;
  color: white !important;
  font-size: 1.25rem;
  font-weight: 600;
  padding: 16px 24px;
}

.dialog-header-dark {
  background-color: #00838F !important;
  color: white !important;
  font-size: 1.25rem;
  font-weight: 600;
  padding: 16px 24px;
}

.search-field {
  /* max-width: 600px; */
}

.modern-table {
  border-radius: 12px;
  overflow: hidden;
}

.modern-table .v-data-table-header {
  background-color: #f9fafb;
  color: #37474f;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modern-table .v-data-table__tr:hover {
  background-color: #f0f7ff !important;
}

/* Text field adjustments for dark theme */
.v-autocomplete.v-input--filled .v-field__input,
.v-number-input.v-input--filled .v-field__input,
.v-textarea.v-input--filled .v-field__input {
  color: #333333; /* Default text color for light theme */
}

.modern-layout-dark .v-autocomplete.v-input--filled .v-field__input,
.modern-layout-dark .v-number-input.v-input--filled .v-field__input,
.modern-layout-dark .v-textarea.v-input--filled .v-field__input {
  color: #ffffff; /* White text color for dark theme */
}

.v-autocomplete.v-input--filled .v-label,
.v-number-input.v-input--filled .v-label,
.v-textarea.v-input--filled .v-label {
  color: #757575; /* Default label color for light theme */
}

.modern-layout-dark .v-autocomplete.v-input--filled .v-label,
.modern-layout-dark .v-number-input.v-input--filled .v-label,
.modern-layout-dark .v-textarea.v-input--filled .v-label {
  color: #bbbbbb; /* Lighter label color for dark theme */
}

.modern-layout-dark .v-autocomplete.v-input--filled .v-field__overlay,
.modern-layout-dark .v-number-input.v-input--filled .v-field__overlay,
.modern-layout-dark .v-textarea.v-input--filled .v-field__overlay {
  background-color: rgba(255, 255, 255, 0.1); /* Slightly transparent white for dark theme input background */
}

.modern-layout-dark .v-data-table-virtual :deep(th),
.modern-layout-dark .v-data-table-virtual :deep(td) {
  color: #ffffff !important; /* White text for table headers and cells in dark mode */
}

.modern-layout-dark .modern-table .v-data-table-header {
  background-color: #424242 !important;
}

.modern-layout-dark .modern-table .v-data-table__tr:hover {
  background-color: #333333 !important;
}

.modern-layout-dark .search-field .v-field__input,
.modern-layout-dark .search-field .v-label {
  color: #ffffff !important;
}

.modern-layout-dark .search-field .v-icon {
  color: #bbbbbb !important;
}

.modern-layout-dark .search-field {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.modern-layout-dark .search-field:focus-within {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.modern-layout-dark .v-btn.v-btn--variant-tonal {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}

.modern-layout-dark .v-btn.v-btn--variant-tonal:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
}
</style>
