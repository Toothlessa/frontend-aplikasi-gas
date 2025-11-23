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
              v-model="debtData.customer_id"
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
              v-model.number="debtData.amount_pay"
              label="Total Debt"
              type="number"
              variant="filled"
              rounded="lg"
              prepend-inner-icon="mdi-currency-usd"
              class="mb-3"
            />
            <v-textarea
              v-model="debtData.description"
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
              :disabled="isSaveDisabled"
              :loading="loadingButtonCreate"
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
              :headers="localHeaderSummaryDebt"
              :items="summaryDebtData"
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
              <template v-slot:[`item.total_debt`]="{ item }">
                {{ formatPrice(item.total_debt) }}
              </template>
              <template v-slot:[`item.total_pay`]="{ item }">
                {{ formatPrice(item.total_pay) }}
              </template>
            </v-data-table-virtual>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Debt Details Dialog -->
    <v-dialog v-model="DialogDetail" max-width="900px" rounded="xl" persistent>
      <v-card class="debt-dialog-card" rounded="xl">
        <v-card-title class="debt-card-header">
          <v-icon start>mdi-text-box-multiple-outline</v-icon>
          <span class="text-h6 font-weight-bold">Debt Details</span>
        </v-card-title>
        <v-card-text class="pa-4">
          <v-data-table-virtual
            :headers="localHeaderDetailDebt"
            :items="debts"
            :loading="loadingDataDetail"
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
            <template v-slot:[`item.amount_pay`]="{ item }">
              {{ formatPrice(item.amount_pay) }}
            </template>
            <template v-slot:[`item.total`]="{ item }">
              {{ formatPrice(item.total) }}
            </template>
          </v-data-table-virtual>
        </v-card-text>
        <v-card-actions class="justify-end pa-4">
          <v-btn color="grey-darken-1" variant="text" @click="DialogDetail = false" rounded="lg">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Debt Update Dialog -->
    <v-dialog v-model="DialogUpdate" max-width="600px" rounded="xl" persistent>
      <v-card class="debt-dialog-card" rounded="xl">
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
            v-model="debtUpdateData.customer_id"
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
            v-model.number="debtUpdateData.amount_pay"
            type="number"
            variant="filled"
            rounded="lg"
            prepend-inner-icon="mdi-currency-usd"
            :disabled="!disableAmountPay"
            class="mb-3"
          />
          <v-text-field
            v-model.number="debtUpdateData.total"
            label="Total Debt"
            type="number"
            variant="filled"
            rounded="lg"
            prepend-inner-icon="mdi-cash-multiple"
            :disabled="!disableTotal"
            class="mb-3"
          />
          <v-textarea
            v-model="debtUpdateData.description"
            label="Description"
            variant="filled"
            rounded="lg"
            rows="3"
            prepend-inner-icon="mdi-note-text-outline"
            class="mb-3"
          />
        </v-card-text>
        <v-card-actions class="justify-end pa-4">
          <v-btn color="grey-darken-1" variant="text" @click="DialogUpdate = false" rounded="lg">
            Cancel
          </v-btn>
          <v-btn 
            class="debt-action-btn text-white"
            variant="elevated" 
            @click="updateDebt" 
            rounded="lg"
            :loading="loadingButtonUpdate"
          >
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
import { onMounted } from 'vue';
import { useDebt } from '@/composables/useDebt';
import { useCustomer } from '@/composables/useCustomer';
import { useGlobal } from '@/composables/useGlobal';

const{
  search,
  formatPrice,
} = useGlobal();

const {
    localHeaderDetailDebt,
    localHeaderSummaryDebt,
    debtData,
    debtUpdateData,
    debts,
    summaryDebtData,

    // UI Flags
    DialogDetail,
    DialogUpdate,
    hasSaved,
    loadingData,
    loadingDataDetail,
    loadingButtonCreate,
    loadingButtonUpdate,
    isPay,
    disableAmountPay,
    disableTotal,

    // Error Handling
    alert,
    error,

    // Computed & Utils
    isSaveDisabled,

    // API & Actions
    debtSummaryLoad,
    detailDebt,
    saveDebt,
    editDebt,
    updateDebt,
} = useDebt();

const {
  customers,
  loadCustomerData,
} = useCustomer();

onMounted(() => {
  debtSummaryLoad();
  // customerLoad();
  loadCustomerData();
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