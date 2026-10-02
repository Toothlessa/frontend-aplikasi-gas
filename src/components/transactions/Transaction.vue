<template>
  <div :class="isDark ? 'modern-layout-dark' : 'modern-layout-light'">
    <v-container fluid>
      <!-- Header -->
      <v-sheet
        class="page-header"
        elevation="3"
        rounded="xl"
        :class="isDark ? 'page-header-dark' : 'page-header-light'"
      >
        <v-row align="center" class="pa-2">
          <v-col cols="auto">
            <v-avatar color="white" size="48">
              <v-icon icon="mdi-swap-horizontal-bold" color="cyan-darken-2" size="36" />
            </v-avatar>
          </v-col>
          <v-col>
            <h1 class="text-h6 font-weight-bold text-white">
              Transactions
            </h1>
            <p class="text-body-2 text-white mt-1" style="opacity: 0.9;">
              Manage and track all your financial transactions
            </p>
          </v-col>
        </v-row>
      </v-sheet>

      <v-row class="mt-8">
        <!-- Left Column: Input Form -->
        <v-col cols="12" md="3">
          <v-card class="form-card rounded-xl elevation-2" :class="isDark ? 'form-card-dark' : 'form-card-light'">
            <v-card-title :class="isDark ? 'card-header-dark' : 'card-header-light'">
              <v-icon start>mdi-cash-register</v-icon>
              New Transaction
            </v-card-title>
            <v-card-text class="pa-5">

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
                @keyup.enter="onCreateTransaction"
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
                @keyup.enter="onCreateTransaction"
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
                @click="onCreateTransaction"
              >
                <v-icon left>mdi-content-save</v-icon>
                Save Transaction
              </v-btn>
            </v-card-text>
          </v-card>

          <v-card class="form-card rounded-xl mt-6" elevation="2" :class="isDark ? 'form-card-dark' : 'form-card-light'">
            <v-card-title :class="isDark ? 'card-header-dark' : 'card-header-light'">
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
          <v-card class="list-card rounded-xl" elevation="2" :class="isDark ? 'list-card-dark' : 'list-card-light'">
            <v-card-title :class="isDark ? 'card-header-dark' : 'card-header-light'" class="d-flex align-center">
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
            <v-divider :style="isDark ? 'border-color: rgba(255,255,255,0.08);' : ''" />
            <v-data-table-virtual
              :class="isDark ? 'modern-table-dark' : 'modern-table-light'"
              v-model:search="search"
              :headers="headersLocal"
              :items="transactions"
              :loading="loading"
              loading-text="Loading data..."
              hover
            >
              <template v-slot:[`item.customer_name`]="{ item }">
                {{ item.raw?.customer?.name || item.raw?.name || '' }}
              </template>
              <template v-slot:[`item.description`]="{ value }">
                <v-chip :color="getColorByDescription(value)" size="small" class="font-weight-bold">
                  {{ value }}
                </v-chip>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn icon="mdi-pencil-outline" variant="text" :color="isDark ? 'cyan-accent-2' : 'blue-grey'" @click="editTransaction(item.raw || item)" />
              </template>
              <template v-slot:[`item.amount`]="{ item }">
                {{ formatPrice(item.raw?.amount ?? item.amount) }}
              </template>
              <template v-slot:[`item.total`]="{ item }">
                {{ formatPrice(item.raw?.total ?? item.total) }}
              </template>
            </v-data-table-virtual>
          </v-card>
        </v-col>
      </v-row>

      <v-dialog v-model="DialogUpdate" max-width="600px" persistent>
        <v-card rounded="xl" :class="isDark ? 'dialog-card-dark' : 'dialog-card-light'">
          <v-card-title :class="isDark ? 'dialog-header-dark' : 'dialog-header-light'">
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
              @click="onCreateTransaction"
              rounded="lg"
            >
              <v-icon left>mdi-content-save-edit</v-icon>
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="DialogDate" max-width="400px" persistent>
        <v-card rounded="xl" :class="isDark ? 'dialog-card-dark' : 'dialog-card-light'">
          <v-card-title :class="isDark ? 'dialog-header-dark' : 'dialog-header-light'">
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

    </v-container>

    <!-- Error & Success Snackbars -->
    <SnackbarError :messages="validationErrorMessages" v-model="validationShowError" :timeout="2000" />
    <SnackbarSuccess v-model="hasSaved" message="Action completed successfully!" :timeout="2000" />

  </div>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { VNumberInput } from 'vuetify/lib/labs/components.mjs';
import { useTransaction } from '@/composables/useTransaction';
import { useCustomer } from '@/composables/useCustomer';
import { useMasterItem } from '@/composables/useMasterItem';
import { useGlobal } from '@/composables/useGlobal';
import { SnackbarError, SnackbarSuccess } from '@/components/globalComponent';

  /* -----------------------------------------------------*
   * COMPOSABLES                                          *
   * ---------------------------------------------------- */
const {
  formatPrice,

  validationErrorMessages,
  validationShowError,
  validationError,
} = useGlobal();

const {
    theme,

    // state
    search,
    editedIndex,
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

    // headers
    headersLocal,

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

    resetTransactionData,
    getDateOptions,

    // actions
    createTransaction,
    editTransaction,
    close,
    checkIsSend,
    getTransactionByDate
} = useTransaction();

const isDark = computed(() => theme.global.current.value.dark);

const {
  //computed
  customers,
  //function
  loadCustomerData,
  loadTopCustomerTransaction,
} = useCustomer();

const {
  mItems,
  //loadMasterItemByType,
  loadMitemGasIsi,
} = useMasterItem();

  /* -----------------------------------------------------*
   * LIFECYCLE                                            *
   * ---------------------------------------------------- */
onMounted(() => {
  onLoadCustomerData();
  onLoadTopCustomerTransaction();
 // onLoadMasterItemByType('ITEM');
  onLoadMasterItemGasIsi();
  onGetTransactionByDate();
});

  /* -----------------------------------------------------*
   * CONSTANTS AND API's                                  *
   * ---------------------------------------------------- */
  const onCreateTransaction = async () => {
    try {
      const isUpdate = editedIndex.value > -1;

      const postData = JSON.parse(
        JSON.stringify(isUpdate ? transactionUpdate : transactionData)
      );

      await createTransaction(postData);
      await onGetTransactionByDate();

      resetTransactionData();
      DialogUpdate.value = false;
    } catch (e) {
      validationError(e);
    }
  };

    const onGetTransactionByDate = async () => {
    try {
      const formattedDate = getDateOptions(pickDate.value ?? new Date());
      await getTransactionByDate();

      // Set readable title
      dateTitle.value = pickDate.value.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });

      // Disable fields if selected date is today
      fieldDisabled.value =
        getDateOptions(new Date()) === formattedDate;

    } catch (e) {
      validationError(e);
    }
  };

  const onLoadCustomerData = async () => {
    try {
      await loadCustomerData();
    } catch (e) {
      validationError(e);
    }
  };

  // const onLoadMasterItemByType = async (type: string) => {
  //   try {
  //     await loadMasterItemByType(type);
  //   } catch (e) {
  //     validationError(e);
  //   }
  // };
  const onLoadMasterItemGasIsi = async () => {
    try {
      await loadMitemGasIsi();
    } catch (e) {
      validationError(e);
    }
  };

  const onLoadTopCustomerTransaction = async () => {
    try {
      await loadTopCustomerTransaction();
    } catch (e) {
      validationError(e);
    }
  };

</script>

<style scoped>
.modern-layout-light {
  background-color: #f8fafc;
  min-height: 100vh;
}

.modern-layout-dark {
  background-color: #121214;
  min-height: 100vh;
}

.page-header-light {
  background: linear-gradient(135deg, #00BCD4 0%, #26C6DA 100%);
  color: white;
}

.page-header-dark {
  background: linear-gradient(135deg, #00838F 0%, #0097A7 100%);
  color: white;
}

/* Card Styles */
.form-card-light, .list-card-light, .dialog-card-light {
  background-color: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04) !important;
  transition: box-shadow 0.25s ease;
}

.form-card-dark, .list-card-dark, .dialog-card-dark {
  background-color: #1e1e24 !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
  transition: box-shadow 0.25s ease;
}

.form-card-light:hover, .list-card-light:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
}

.form-card-dark:hover, .list-card-dark:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35) !important;
}

.card-header-light {
  background-color: #00BCD4 !important;
  color: white !important;
  font-size: 1.15rem;
  font-weight: 600;
}

.card-header-dark {
  background-color: #00838F !important;
  color: white !important;
  font-size: 1.15rem;
  font-weight: 600;
}

.dialog-header-light {
  background-color: #00BCD4 !important;
  color: white !important;
  font-size: 1.2rem;
  font-weight: 600;
  padding: 16px 24px;
}

.dialog-header-dark {
  background-color: #00838F !important;
  color: white !important;
  font-size: 1.2rem;
  font-weight: 600;
  padding: 16px 24px;
}

/* Modern Table Light */
.modern-table-light {
  border-radius: 12px;
  overflow: hidden;
}
.modern-table-light :deep(.v-table__wrapper) {
  background-color: transparent !important;
}
.modern-table-light :deep(thead) {
  background-color: #f8fafc;
}
.modern-table-light :deep(th) {
  color: #475569 !important;
  font-weight: 600 !important;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e2e8f0 !important;
  padding: 12px 16px !important;
}
.modern-table-light :deep(td) {
  color: #1e293b !important;
  padding: 12px 16px !important;
  border-bottom: 1px solid #f1f5f9 !important;
}
.modern-table-light :deep(tbody tr:hover td) {
  background-color: #f0fdfa !important;
}

/* Modern Table Dark */
.modern-table-dark {
  border-radius: 12px;
  overflow: hidden;
}
.modern-table-dark :deep(.v-table__wrapper) {
  background-color: transparent !important;
}
.modern-table-dark :deep(thead) {
  background-color: rgba(255, 255, 255, 0.04);
}
.modern-table-dark :deep(th) {
  color: #cbd5e1 !important;
  font-weight: 600 !important;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  padding: 12px 16px !important;
}
.modern-table-dark :deep(td) {
  color: #f1f5f9 !important;
  padding: 12px 16px !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}
.modern-table-dark :deep(tbody tr:hover td) {
  background-color: rgba(0, 188, 212, 0.12) !important;
}

/* Form Controls Adjustments for Dark Mode */
.modern-layout-dark :deep(.v-field__input) {
  color: #ffffff !important;
}
.modern-layout-dark :deep(.v-field__outline) {
  color: rgba(255, 255, 255, 0.18) !important;
}
.modern-layout-dark :deep(.v-field--focused .v-field__outline) {
  color: #00bcd4 !important;
}
.modern-layout-dark :deep(.v-field--variant-filled .v-field__overlay) {
  background-color: rgba(255, 255, 255, 0.06) !important;
}
.modern-layout-dark :deep(.v-label) {
  color: #94a3b8 !important;
}
.modern-layout-dark :deep(.v-checkbox .v-label) {
  color: #e2e8f0 !important;
}
.modern-layout-dark :deep(.v-messages) {
  color: #94a3b8 !important;
}

.modern-layout-dark .search-field {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-radius: 24px;
}
.modern-layout-dark .search-field :deep(.v-field__input),
.modern-layout-dark .search-field :deep(.v-label) {
  color: #ffffff !important;
}
.modern-layout-dark .search-field :deep(.v-icon) {
  color: #94a3b8 !important;
}
</style>
