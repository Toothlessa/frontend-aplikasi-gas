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
                v-model="selectedCustomer"
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
                v-model="editedItem.quantity"
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
                v-model="editedItem.description"
                variant="outlined"
                rounded="lg"
                rows="2"
                :disabled="!fieldDisabled"
                prepend-inner-icon="mdi-note-text-outline"
                class="mb-4"
                @keyup.enter="save"
              />

              <v-autocomplete
                v-model="editedItem.amount"
                variant="outlined"
                rounded="lg"
                :items="harga"
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
                :loading="loadingButton"
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
                v-model="selectedItem"
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
                <v-btn color="white" variant="tonal" @click="dialog = true" class="mr-3">
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
              :headers="headers"
              :items="transactions"
              :loading="loadingData"
              loading-text="Loading data..."
              hover
            >
              <template v-slot:[`item.description`]="{ value }">
                <v-chip :color="getColorByDescription(value)" size="small" class="font-weight-bold">
                  {{ value }}
                </v-chip>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn icon="mdi-pencil-outline" variant="text" color="blue-grey" @click="editItem(item)" />
              </template>
            </v-data-table-virtual>
          </v-card>
        </v-col>
      </v-row>

      Dialogs
      <v-dialog v-model="dialogUpdate" max-width="600px" persistent>
        <v-card rounded="xl">
          <v-card-title :class="theme.global.current.value.dark ? 'dialog-header-dark' : 'dialog-header-light'">
            <v-icon start>mdi-update</v-icon>
            Update Transaction
          </v-card-title>
          <v-card-text class="pa-5">
             <v-autocomplete
                label="Customer"
                v-model="updateTrx.customer_id"
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
                v-model="updateTrx.quantity"
                variant="filled"
                rounded="lg"
                controlVariant="split"
                prepend-inner-icon="mdi-counter"
                class="mb-4"
              />

              <v-textarea
                label="Description"
                v-model="updateTrx.description"
                variant="filled"
                rounded="lg"
                rows="2"
                prepend-inner-icon="mdi-note-text-outline"
                class="mb-4"
              />

              <v-autocomplete
                v-model="updateTrx.amount"
                variant="filled"
                rounded="lg"
                :items="harga"
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
              :loading="loadingButton"
              @click="save"
              rounded="lg"
            >
              <v-icon left>mdi-content-save-edit</v-icon>
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialog" max-width="400px" persistent>
        <v-card rounded="xl">
          <v-card-title :class="theme.global.current.value.dark ? 'dialog-header-dark' : 'dialog-header-light'">
            <v-icon start>mdi-calendar-search</v-icon>
            Select Date
          </v-card-title>
          <v-card-text class="pa-0">
            <v-date-picker
              v-model="pickDate"
              color="cyan-darken-2"
              @update:model-value="getTransactionByDate(); dialog = false"
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
import { ref, computed, onMounted, reactive } from 'vue';
import AxiosInstance from '@/services/AxiosInstance';
import store from '@/store/store';
import { GET_USER_TOKEN_GETTER } from '@/store/storeconstant';
import { VNumberInput } from 'vuetify/lib/labs/components.mjs';
import { useTheme } from 'vuetify';

interface Transaction {
  customer_name: string;
  description: string | null;
  quantity: number | null;
  amount: number;
  total: number;
  created_at: string;
  id: number;
  stock_id: number;
  customer_id: number | null;
}

const theme = useTheme();

const editedIndex = ref(-1);

const search = ref('');
const headers = [
  { title: 'Customer', align: 'start', key: 'customer_name', class: 'text-subtitle-1' },
  { title: 'Description', align: 'center', key: 'description', class: 'text-subtitle-1' },
  { title: 'Qty', align: 'center', key: 'quantity', class: 'text-subtitle-1' },
  { title: 'Price', align: 'start', key: 'amount', value: (item: Transaction) => formatPrice(item.amount), class: 'text-subtitle-1' },
  { title: 'Total', align: 'start', key: 'total', value: (item: Transaction) => formatPrice(item.total), class: 'text-subtitle-1' },
  { title: 'Created', align: 'start', key: 'created_at', class: 'text-subtitle-1' },
  { title: 'Actions', align: 'center', key: 'actions', sortable: false, class: 'text-subtitle-1' },
];

const transactions = ref<Transaction[]>([]);
const customers = ref<{id: number, customer_name: string, nik: string}[]>([]);
const mItems = ref<{id: number, item_name: string}[]>([]);
const pickDate = ref(new Date());
const dateTitle = ref('');
const fieldDisabled = ref(true);
const dialogUpdate = ref(false);
const dialog = ref(false);
const selectedCustomer = ref<number | null>(1);
const selectedItem = ref(1);
const isEditAmt = ref(false);
const isEditing = ref(false);
const isSend = ref(false);
const hasSaved = ref(false);
const loadingButton = ref(false);
const loadingData = ref(true);
const alert = ref(false);
const error = ref('');

const updateTrx = reactive({
  customer_id: null,
  quantity: null,
  description: null,
  amount: 0,
  total: 0,
  stock_id: null,
  id: null,
});

const editedItem = reactive({
  customer_id: null,
  customer_name: null,
  nik: null,
  description: null,
  quantity: null,
  amount: 19000,
  total: 0,
  created_at: '',
});

const harga = [
  { name: "Rp 16.000", value: 16000 },
  { name: "Rp 17.000", value: 17000 },
  { name: "Rp 18.000", value: 18000 },
  { name: "Rp 19.000", value: 19000 },
  { name: "Rp 20.000", value: 20000 },
];

const isSaveDisabled = computed(() => !(selectedCustomer.value && editedItem.quantity));
const isUpdateDisabled = computed(() => !(updateTrx.customer_id && updateTrx.quantity));

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const getColorByDescription = (description: string | null) => {
  if (description == null) return 'grey';
  const lowerDesc = description.toLowerCase();
  if (lowerDesc.startsWith("kirim")) return 'cyan';
  else if (lowerDesc.startsWith("titip")) return 'orange';
  else if (lowerDesc.startsWith("pisah")) return 'deep-purple';
  else if (lowerDesc.startsWith("uang")) return 'amber';
  else return 'green';
};

const getDateOptions = (dateConv: Date) => {
  const date = new Date(dateConv);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().split('T')[0];
};

const getCustomer = async () => {
  try {
    const response = await AxiosInstance.get<{data: {id: number, customer_name: string, nik: string}[]}>(`customers/all`, {
      headers: {
        'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
      },
    });
    customers.value = response.data.data;
  } catch (err) {
    error.value = "Failed to load customers.";
    alert.value = true;
  }
};

const getMasterItem = async () => {
  try {
    const response = await AxiosInstance.get<{data: {id: number, item_name: string}[]}>(`masteritems/itemtype/ITEM`, {
       headers: {
        'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
      },
    });
    mItems.value = response.data.data;
  } catch (err) {
    error.value = "Failed to load items.";
    alert.value = true;
  }
};

const getTransactionByDate = async () => {
  loadingData.value = true;
  try {
    const formattedDate = getDateOptions(pickDate.value);
    const response = await AxiosInstance.get<{data: Transaction[]}>(`transactions/date/${formattedDate}`, {
       headers: {
        'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
      },
    });
    transactions.value = response.data.data;
    
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    dateTitle.value = pickDate.value.toLocaleDateString('id-ID', options);

    fieldDisabled.value = getDateOptions(new Date()) === formattedDate;

  } catch (err) {
    error.value = "Failed to load transactions.";
    alert.value = true;
  } finally {
    loadingData.value = false;
  }
};

const save = async () => {
  loadingButton.value = true;
  try {
    let response;
    if (editedIndex.value > -1) {
      // Update logic
      const postData = {
        stock_id: updateTrx.stock_id,
        stock: -(updateTrx.quantity || 0),
        customer_id: updateTrx.customer_id,
        quantity: updateTrx.quantity,
        description: updateTrx.description,
        amount: updateTrx.amount,
        total: (updateTrx.amount || 0) * (updateTrx.quantity || 0),
      };
      response = await AxiosInstance.patch(`transactions/${updateTrx.id}`, postData, {
         headers: {
          'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
        },
      });
    } else {
      // Create logic
      const postData = {
        stock: -(editedItem.quantity || 1),
        customer_id: selectedCustomer.value || 1,
        item_id: selectedItem.value,
        quantity: editedItem.quantity || 1,
        description: editedItem.description,
        amount: editedItem.amount,
        total: (editedItem.amount || 0) * (editedItem.quantity || 1),
      };
      response = await AxiosInstance.post('/transactions', postData, {
         headers: {
          'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
        },
      });
    }

    if (response.status === 200 || response.status === 201) {
      await getTransactionByDate();
      hasSaved.value = true;
      close();
      resetForm();
    }
  } catch (err) {
    error.value = "An error occurred while saving.";
    alert.value = true;
  } finally {
    loadingButton.value = false;
  }
};

const editItem = (item: Transaction) => {
  editedIndex.value = transactions.value.findIndex(t => t.id === item.id);
  Object.assign(updateTrx, item);
  dialogUpdate.value = true;
};

const close = () => {
  dialogUpdate.value = false;
  setTimeout(() => {
    editedIndex.value = -1;
    Object.assign(updateTrx, { customer_id: null, quantity: null, description: null, amount: 0, total: 0, stock_id: null, id: null });
  }, 300);
};

const resetForm = () => {
    selectedCustomer.value = null;
    editedItem.quantity = null;
    editedItem.description = null;
    editedItem.amount = 19000;
    isSend.value = false;
}

const checkIsSend = () => {
  if (isSend.value) {
    editedItem.amount = 19000;
  } else {
    editedItem.amount = 20000;
  }
};

onMounted(() => {
  getCustomer();
  getTransactionByDate();
  getMasterItem();
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
