<template>
  <v-container fluid class="debt-page-container">
    <v-row>
      <!-- Input Debt Card -->
      <v-col cols="8" md="4">
        <v-card class="debt-card" rounded="xl" elevation="6">
          <v-card-title class="debt-card-header">
            <v-icon start>mdi-cash-plus</v-icon>
            <span class="text-h6 font-weight-bold">Input Debt</span>
          </v-card-title>
          <v-card-text class="pa-2">
            <v-alert
              v-if="error"
              v-model="alert"
              type="error"
              closable
              variant="tonal"
              class="mb-4"
            >
              {{ error }}
            </v-alert>
            <v-autocomplete
              label="Customer Name"
              v-model="selectedCustomer"
              :items="customers"
              item-title="customer_name"
              item-value="id"
              variant="filled"
              rounded="lg"
              prepend-inner-icon="mdi-account-tie"
              class="mb-3"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :subtitle="item.raw.nik"
                  :title="item.raw.customer_name"
                />
              </template>
            </v-autocomplete>
            <v-text-field
              v-model.number="editedDebt.amount"
              label="Total Debt"
              type="number"
              variant="filled"
              rounded="lg"
              prepend-inner-icon="mdi-currency-usd"
              class="mb-3"
            />
            <v-textarea
              v-model="editedDebt.description"
              label="Description"
              variant="filled"
              rounded="lg"
              rows="3"
              prepend-inner-icon="mdi-note-text-outline"
              class="mb-3"
            />
            <v-checkbox
              v-model="isPay"
              label="Pay Debt?"
              color="teal-darken-1"
              hide-details
              class="mt-n2 mb-3"
            />
            <v-btn
              block
              class="debt-action-btn text-white"
              variant="elevated"
              size="large"
              rounded="lg"
              color="teal-darken-1"
              :disabled="isSaveDisabled"
              :loading="loadingButton"
              @click="saveDebt"
            >
              <v-icon start>mdi-content-save</v-icon>
              Save Debt
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Debt List Summary Card -->
      <v-col cols="12" md="8">
        <v-card class="debt-card" rounded="xl" elevation="6">
          <v-card-title class="debt-card-header">
            <v-icon start>mdi-format-list-bulleted</v-icon>
            <span class="text-h6 font-weight-bold">Debt List Summary</span>
          </v-card-title>
          <v-card-text class="pa-4">
            <v-data-table-virtual
              :headers="headers"
              :items="debts"
              :search="search"
              :loading="loadingData"
              loading-text="Loading debt data..."
              class="modern-data-table"
              fixed-header
              height="400px"
              hover
            >
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                  icon="mdi-information-outline"
                  size="small"
                  variant="text"
                  color="blue-grey"
                  @click="detailDebt(item)"
                />
              </template>
            </v-data-table-virtual>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Debt Details Dialog -->
    <v-dialog v-model="dialogDetails" max-width="900px" rounded="xl">
      <v-card class="debt-dialog-card">
        <v-card-title class="debt-card-header">
          <v-icon start>mdi-text-box-multiple-outline</v-icon>
          <span class="text-h6 font-weight-bold">Debt Details</span>
        </v-card-title>
        <v-card-text class="pa-4">
          <v-data-table-virtual
            :headers="detailHeaders"
            :items="customerDetail"
            class="modern-data-table"
            fixed-header
            height="300px"
            hover
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                icon="mdi-pencil"
                size="small"
                variant="text"
                color="blue-grey"
                @click="editDebt(item)"
              />
            </template>
          </v-data-table-virtual>
        </v-card-text>
        <v-card-actions class="justify-end pa-4">
          <v-btn color="grey-darken-1" variant="text" @click="dialogDetails = false" rounded="lg">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Debt Update Dialog -->
    <v-dialog v-model="dialogUpdate" max-width="600px" rounded="xl">
      <v-card class="debt-dialog-card">
        <v-card-title class="debt-card-header">
          <v-icon start>mdi-update</v-icon>
          <span class="text-h6 font-weight-bold">Update Debt</span>
        </v-card-title>
        <v-card-text class="pa-4">
          <v-alert
            v-if="error"
            v-model="alert"
            type="error"
            closable
            variant="tonal"
            class="mb-4"
          >
            {{ error }}
          </v-alert>
          <v-autocomplete
            label="Customer Name"
            v-model="updateCustomer"
            :items="customers"
            item-title="customer_name"
            item-value="id"
            variant="filled"
            rounded="lg"
            prepend-inner-icon="mdi-account-tie"
            class="mb-3"
          />
          <v-text-field
            label="Pay Amount"
            v-model.number="updatedDebt.amount_pay"
            type="number"
            variant="filled"
            rounded="lg"
            prepend-inner-icon="mdi-currency-usd"
            :disabled="!disableAmountPay"
            class="mb-3"
          />
          <v-text-field
            v-model.number="updatedDebt.total"
            label="Total Debt"
            type="number"
            variant="filled"
            rounded="lg"
            prepend-inner-icon="mdi-cash-multiple"
            :disabled="!disableTotal"
            class="mb-3"
          />
          <v-textarea
            v-model="updatedDebt.description"
            label="Description"
            variant="filled"
            rounded="lg"
            rows="3"
            prepend-inner-icon="mdi-note-text-outline"
            class="mb-3"
          />
        </v-card-text>
        <v-card-actions class="justify-end pa-4">
          <v-btn color="grey-darken-1" variant="text" @click="dialogUpdate = false" rounded="lg">
            Cancel
          </v-btn>
          <v-btn color="teal-darken-1" variant="elevated" @click="updateDebt" rounded="lg">
            <v-icon start>mdi-content-save</v-icon>
            Update Debt
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="hasSaved"
      :timeout="2000"
      location="top right"
      color="success"
      rounded="xl"
      elevation="12"
    >
      <v-icon start>mdi-check-circle-outline</v-icon>
      Data saved successfully!
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import AxiosInstance from '@/services/AxiosInstance';
import Validations from '@/services/Validations';
import store from '@/store/store';
import { GET_USER_TOKEN_GETTER } from '@/store/storeconstant';

const search = ref('');
const headers = [
  { align: 'start', key: 'customer_name', title: 'Customer Name' },
  { key: 'total_debt', title: 'Total Debt', align: 'end' },
  { key: 'total_pay', title: 'Total Pay', align: 'end' },
  { key: 'debt_left', title: 'Debt Left', align: 'end' },
  { key: 'actions', title: 'Details', align: 'center', sortable: false },
];

const detailHeaders = [
  { title: 'Customer Name', key: 'customer_name' },
  { title: 'Description', key: 'description' },
  { title: 'Paid Amount', key: 'amount_pay', align: 'end' },
  { title: 'Total Debt', key: 'total', align: 'end' },
  { title: 'Created Date', key: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const editedDebt = reactive({
  customer_id: null,
  customer_name: null,
  amount: null,
  description: null,
});

const updatedDebt = reactive({
  id: null,
  amount_pay: 0,
  total: 0,
  description: null,
});

const updateCustomer = ref(null);
const selectedCustomer = ref(null);
const debts = ref([]);
const customers = ref([]);
const customerDetail = ref([]);
const dialogDetails = ref(false);
const dialogUpdate = ref(false);
const hasSaved = ref(false);
const loadingData = ref(true);
const loadingButton = ref(false);
const isPay = ref(false);
const disableAmountPay = ref(false);
const disableTotal = ref(false);
const alert = ref(false);
const error = ref('');

const isSaveDisabled = computed(() => !(selectedCustomer.value && editedDebt.amount && editedDebt.description));

const formatPrice = (value: number) => {
  if (isNaN(value) || value === null || value === undefined) {
    return 'Rp0';
  }
  return `Rp${parseFloat(String(value)).toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$&.')}`;
};

const customerLoad = async () => {
  try {
    const response = await AxiosInstance.get(`http://127.0.0.1:8000/api/customers/all`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
      },
    });
    if (response.status === 200) {
      customers.value = response.data.data;
    }
  } catch (err: any) {
    error.value = Validations.getErrorMessageFromCode(err.response.data.errors[0]);
    alert.value = true;
  }
};

const debtSummaryLoad = async () => {
  try {
    const response = await AxiosInstance.get(`http://127.0.0.1:8000/api/debts/summary`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
      },
    });
    if (response.status === 200) {
      debts.value = response.data.data;
      loadingData.value = false;
    }
  } catch (err: any) {
    error.value = Validations.getErrorMessageFromCode(err.response.data.errors[0]);
    alert.value = true;
  }
};

const detailDebt = async (item: any) => {
  Object.assign(editedDebt, item);
  try {
    const response = await AxiosInstance.get(`http://127.0.0.1:8000/api/debts/customer/${editedDebt.customer_id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
      },
    });
    if (response.status === 200) {
      customerDetail.value = response.data.data.map((detail: any) => ({
        ...detail,
        customer_name: item.customer_name, // Add customer_name from the summary item
        amount_pay: formatPrice(detail.amount_pay),
        total: formatPrice(detail.total),
      }));
    }
  } catch (err: any) {
    error.value = Validations.getErrorMessageFromCode(err.response.data.errors[0]);
    alert.value = true;
  }
  dialogDetails.value = true;
};

const saveDebt = async () => {
  loadingButton.value = true;
  let postData: any = {};
  if (isPay.value) {
    postData = {
      description: editedDebt.description,
      amount_pay: editedDebt.amount,
    };
  } else {
    postData = {
      description: editedDebt.description,
      total: editedDebt.amount,
    };
  }

  try {
    const response = await AxiosInstance.post(`http://127.0.0.1:8000/api/debts/${selectedCustomer.value}`, postData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
      },
    });

    if (response.status === 201) {
      isPay.value = false;
      selectedCustomer.value = null;
      editedDebt.description = null;
      editedDebt.amount = null;
      hasSaved.value = true;
      await debtSummaryLoad(); // Reload summary after saving
    }
  } catch (err: any) {
    error.value = Validations.getErrorMessageFromCode(err.response.data.errors[0]);
    alert.value = true;
  } finally {
    loadingButton.value = false;
  }
};

const editDebt = (item: any) => {
  Object.assign(updatedDebt, item);
  updateCustomer.value = item.customer_id;

  // Convert formatted prices back to numbers for editing
  const parsedAmountPay = parseFloat(String(item.amount_pay).replace(/[^0-9,-]+/g, "").replace(',', '.'));
  const parsedTotal = parseFloat(String(item.total).replace(/[^0-9,-]+/g, "").replace(',', '.'));

  updatedDebt.amount_pay = isNaN(parsedAmountPay) ? 0 : parsedAmountPay;
  updatedDebt.total = isNaN(parsedTotal) ? 0 : parsedTotal;

  if (updatedDebt.amount_pay) {
    disableAmountPay.value = true;
  } else {
    disableAmountPay.value = false;
  }

  if (updatedDebt.total) {
    disableTotal.value = true;
  } else {
    disableTotal.value = false;
  }

  dialogUpdate.value = true;
};

const updateDebt = async () => {
  const postData = {
    customer_id: updateCustomer.value,
    description: updatedDebt.description,
    amount_pay: updatedDebt.amount_pay,
    total: updatedDebt.total,
  };
  try {
    const response = await AxiosInstance.patch(`http://127.0.0.1:8000/api/debts/${updatedDebt.id}`, postData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
      },
    });

    if (response.status === 200) {
      await detailDebt(postData); // Reload details after update
      await debtSummaryLoad(); // Reload summary after update
      updatedDebt.description = null;
      dialogUpdate.value = false;
      hasSaved.value = true;
    }
  } catch (err: any) {
    error.value = Validations.getErrorMessageFromCode(err.response.data.errors[0]);
    alert.value = true;
  }
};

onMounted(() => {
  debtSummaryLoad();
  customerLoad();
});
</script>

<style scoped>
.debt-page-container {
  padding: 24px;
  background-color: #f0f2f5; /* Light gray background for the page */
  min-height: 100vh;
}

.debt-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05) !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.debt-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
}

.debt-card-header {
  background: linear-gradient(45deg, #2196F3 0%, #64B5F6 100%); /* Blue gradient */
  color: white;
  padding: 16px 24px;
  font-size: 1.25rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}

.debt-card-header .v-icon {
  margin-right: 8px;
}

.debt-action-btn {
  font-weight: bold;
  letter-spacing: 0.5px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.v-btn.debt-action-btn {
  background-color: #1976D2 !important; /* Darker Blue for buttons */
}

.v-btn.debt-action-btn:hover {
  background-color: #1565C0 !important;
}

.v-btn.back-btn {
  background-color: #607D8B !important; /* Blue-grey for back button */
}

.v-btn.back-btn:hover {
  background-color: #455A64 !important;
}
</style>