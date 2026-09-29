<template>
  <div :class="isDark ? 'debt-page-dark' : 'debt-page-light'">
    <v-container fluid class="debt-page-container">
      <v-row>
        <!-- Input Debt Card -->
        <v-col cols="8" md="4">
          <v-card class="debt-card rounded-xl" elevation="6" :class="isDark ? 'debt-card-dark' : 'debt-card-light'">
            <v-card-title :class="isDark ? 'card-header-dark' : 'card-header-light'">
              <v-icon start>mdi-cash-plus</v-icon>
              <span class="text-h6 font-weight-bold">Input Debt</span>
            </v-card-title>
            <v-card-text class="pa-2">
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
                @click="onSaveDebt"
              >
                <v-icon start>mdi-content-save</v-icon>
                Save Debt
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Debt List Summary Card -->
        <v-col cols="12" md="8">
          <v-card class="debt-card rounded-xl" elevation="6" :class="isDark ? 'debt-card-dark' : 'debt-card-light'">
            <v-card-title :class="isDark ? 'card-header-dark' : 'card-header-light'">
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
                :class="isDark ? 'modern-table-dark' : 'modern-table-light'"
                fixed-header
                height="400px"
                hover
              >
                <template v-slot:[`item.no`]="{ index }">
                  {{ index + 1 }}
                </template>
                <template v-slot:[`item.total_debt`]="{ item }">
                  {{ formatPrice(item.total_debt) }}
                </template>
                <template v-slot:[`item.total_pay`]="{ item }">
                  {{ formatPrice(item.total_pay) }}
                </template>
                <template v-slot:[`item.debt_left`]="{ item }">
                  {{ formatPrice(item.debt_left) }}
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                  <v-btn
                    icon="mdi-information-outline"
                    size="small"
                    variant="text"
                    :color="isDark ? 'cyan-accent-2' : 'blue-grey'"
                    :loading="loadingDetailDebt === item.customer_id"
                    @click="onLoadDetailDebt(item)"
                  />
                </template>
              </v-data-table-virtual>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Debt Details Dialog -->
      <v-dialog v-model="DialogDetail" max-width="900px" persistent>
        <v-card class="debt-dialog-card rounded-xl" :class="isDark ? 'debt-card-dark' : 'debt-card-light'">
          <v-card-title :class="isDark ? 'card-header-dark' : 'card-header-light'">
            <v-icon start>mdi-text-box-multiple-outline</v-icon>
            <span class="text-h6 font-weight-bold">Debt Details</span>
          </v-card-title>
          <v-card-text class="pa-4">
            <v-data-table-virtual
              :headers="localHeaderDetailDebt"
              :items="debts"
              :loading="loadingDataDetail"
              :class="isDark ? 'modern-table-dark' : 'modern-table-light'"
              fixed-header
              height="300px"
              hover
            >
              <template v-slot:[`item.no`]="{ index }">
                {{ index + 1 }}
              </template>
              <template v-slot:[`item.amount_pay`]="{ item }">
                {{ formatPrice(item.amount_pay) }}
              </template>
              <template v-slot:[`item.total`]="{ item }">
                {{ formatPrice(item.total) }}
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  :color="isDark ? 'cyan-accent-2' : 'blue-grey'"
                  :loading="loadingUpdateDebtAction === item.id"
                  @click="editDebt(item)"
                />
              </template>
            </v-data-table-virtual>
          </v-card-text>
          <v-card-actions class="justify-end pa-4">
            <v-btn
              :color="isDark ? 'grey-lighten-1' : 'grey-darken-1'"
              variant="text"
              @click="closeDialogDetail()"
              rounded="lg"
              :loading="loadingCloseDialogDetail"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Debt Update Dialog -->
      <v-dialog v-model="DialogUpdate" max-width="600px" persistent>
        <v-card class="debt-dialog-card rounded-xl" :class="isDark ? 'debt-card-dark' : 'debt-card-light'">
          <v-card-title :class="isDark ? 'card-header-dark' : 'card-header-light'">
            <v-icon start>mdi-update</v-icon>
            <span class="text-h6 font-weight-bold">Update Debt</span>
          </v-card-title>
          <v-card-text class="pa-4">
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
            <v-btn
              :color="isDark ? 'grey-lighten-1' : 'grey-darken-1'"
              variant="text"
              :loading="loadingCloseUpdateButton"
              @click="CloseDialogUpdate()"
              rounded="lg">
              Close
            </v-btn>
            <v-btn
              class="debt-action-btn text-white"
              variant="elevated"
              @click="onUpdateDebt"
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
      <SnackbarError :messages="validationErrorMessages" v-model="validationShowError" :timeout="2000" />
      <SnackbarSuccess v-model="hasSaved" message="Action completed successfully!" :timeout="2000" />

    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useTheme } from 'vuetify';
import { useDebt } from '@/composables/useDebt';
import { useCustomer } from '@/composables/useCustomer';
import { useGlobal } from '@/composables/useGlobal';
import { Debt } from '@/types';
import { SnackbarError, SnackbarSuccess } from '@/components/globalComponent';

  /* -----------------------------------------------------*
   * COMPOSABLES                                          *
   * ---------------------------------------------------- */
const{
  search,
  formatPrice,

  validationErrorMessages,
  validationShowError,
  validationError,
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

    // Computed & Utils
    isSaveDisabled,

    // API & Actions
    resetDebtData,
    loadSummaryDebt,
    loadDetailDebt,
    saveDebt,
    updateDebt,
    resetDetailDebt,
} = useDebt();

const {
  customers,
  loadCustomerData,
} = useCustomer();

  /* -----------------------------------------------------*
   * THEME                                                *
   * ---------------------------------------------------- */
const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

  /* -----------------------------------------------------*
   * LIFECYCLE                                            *
   * ---------------------------------------------------- */
onMounted(() => {
  onLoadSummaryDebt();
  onLoadCustomerData();
});

/* -----------------------------------------------------*
 * CONSTANTS                                            *
 * ---------------------------------------------------- */
const loadingDetailDebt = ref<number | null | undefined>(null);
const loadingUpdateDebtAction = ref<number | null | undefined>(null);
const loadingCloseDialogDetail = ref<boolean>(false);
const loadingCloseUpdateButton = ref<boolean>(false);

  /* -----------------------------------------------------*
   * METHODS                                              *
   * ---------------------------------------------------- */
const closeDialogDetail = () => {
  loadingCloseDialogDetail.value = true;
  setTimeout(() => {
    DialogDetail.value = false;
    loadingCloseDialogDetail.value = false;
    resetDetailDebt();
  }, 500);
};

const CloseDialogUpdate = () => {
  loadingCloseUpdateButton.value = true;
  setTimeout(() => {
    DialogUpdate.value = false;
    loadingCloseUpdateButton.value = false;
  }, 500);
};

const editDebt = (item: Partial<Debt>) => {
  Object.assign(debtUpdateData, item);

  const parsedAmountPay = parseFloat(
    String(item.amount_pay).replace(/[^0-9,-]+/g, "").replace(",", ".")
  );
  const parsedTotal = parseFloat(
    String(item.total).replace(/[^0-9,-]+/g, "").replace(",", ".")
  );

  debtUpdateData.amount_pay = isNaN(parsedAmountPay) ? 0 : parsedAmountPay;
  debtUpdateData.total = isNaN(parsedTotal) ? 0 : parsedTotal;

  disableAmountPay.value = !!debtUpdateData.amount_pay;
  disableTotal.value = !!debtUpdateData.total;

  loadingUpdateDebtAction.value = item.id;
  DialogUpdate.value = true;
  setTimeout(() => {
    loadingUpdateDebtAction.value = null;
  }, 500);
};

const onLoadCustomerData = async() => {
  try{
    await loadCustomerData();
  }catch(e){
    validationError(e);
  }
};

const onSaveDebt = async() => {
  const payload = { ...debtData };

  if(isPay.value){
    payload.total = 0;
  }else{
    payload.total = payload.amount_pay;
    payload.amount_pay = 0;
  }

  try{
    await saveDebt(payload);
    resetDebtData(debtData);
    isPay.value = false;
  }catch(e){
    validationError(e);
  }
};

const onLoadSummaryDebt = async() => {
  try{
    await loadSummaryDebt();
  }catch(e){
    validationError(e);
  }
};

const onLoadDetailDebt = async(item: Partial<Debt>) => {
  loadingDetailDebt.value = item.customer_id;
  Object.assign(debtUpdateData, item);
  try{
    DialogDetail.value  = true;
    await loadDetailDebt();
  }catch(e){
    validationError(e);
    validationShowError.value = true;
  }finally{
    loadingDetailDebt.value = null;
  }
};

const onUpdateDebt = async() => {
  try{
    await updateDebt();
    await loadDetailDebt();

    setTimeout(() => {
      DialogUpdate.value = false;
      resetDebtData(debtUpdateData);
    }, 1000);
  }catch(e){
    validationError(e);
  }
};

</script>

<style scoped>
.debt-page-container {
  padding: 24px;
}

.debt-page-light {
  background-color: #f8fafc;
  min-height: 100vh;
}

.debt-page-dark {
  background-color: #121214;
  min-height: 100vh;
}

/* Cards */
.debt-card-light {
  background-color: #ffffff ;
  border: 1px solid #e2e8f0 ;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04) ;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.debt-card-dark {
  background-color: #1e1e24 ;
  border: 1px solid rgba(255, 255, 255, 0.08) ;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) ;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.debt-card-light:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) ;
}

.debt-card-dark:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35) ;
}

/* Card Headers */
.card-header-light {
  background: linear-gradient(45deg, #2196F3 0%, #64B5F6 100%);
  color: white ;
  padding: 16px 24px;
  font-size: 1.15rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.card-header-dark {
  background: linear-gradient(45deg, #0D47A1 0%, #1976D2 100%);
  color: white ;
  padding: 16px 24px;
  font-size: 1.15rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header-light .v-icon,
.card-header-dark .v-icon {
  margin-right: 8px;
}

/* Data Table Light */
.modern-table-light {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}
.modern-table-light :deep(.v-table__wrapper) {
  background-color: transparent ;
}
.modern-table-light :deep(thead) {
  background-color: #f8fafc;
}
.modern-table-light :deep(th) {
  color: #475569 ;
  font-weight: 600 ;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e2e8f0 ;
}
.modern-table-light :deep(td) {
  color: #1e293b ;
  font-size: 0.9rem;
  border-bottom: 1px solid #f1f5f9 ;
}
.modern-table-light :deep(tbody tr:hover td) {
  background-color: #e3f2fd ;
}

/* Data Table Dark */
.modern-table-dark {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.modern-table-dark :deep(.v-table__wrapper) {
  background-color: transparent ;
}
.modern-table-dark :deep(thead) {
  background-color: rgba(255, 255, 255, 0.04);
}
.modern-table-dark :deep(th) {
  color: #cbd5e1 ;
  font-weight: 600 ;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) ;
}
.modern-table-dark :deep(td) {
  color: #f1f5f9 ;
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) ;
}
.modern-table-dark :deep(tbody tr:hover td) {
  background-color: rgba(33, 150, 243, 0.14) ;
}

/* Buttons */
.debt-action-btn {
  font-weight: bold;
  letter-spacing: 0.5px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.v-btn.debt-action-btn {
  background-color: #1976D2 ;
}

.v-btn.debt-action-btn:hover {
  background-color: #1565C0 ;
}

/* Form Controls Adjustments for Dark Mode */
.debt-page-dark :deep(.v-field__input) {
  color: #ffffff ;
}
.debt-page-dark :deep(.v-field__outline) {
  color: rgba(255, 255, 255, 0.18) ;
}
.debt-page-dark :deep(.v-field--focused .v-field__outline) {
  color: #2196F3 ;
}
.debt-page-dark :deep(.v-field--variant-filled .v-field__overlay) {
  background-color: rgba(255, 255, 255, 0.06) ;
}
.debt-page-dark :deep(.v-label) {
  color: #94a3b8 ;
}
.debt-page-dark :deep(.v-checkbox .v-label) {
  color: #e2e8f0 ;
}
.debt-page-dark :deep(.v-messages) {
  color: #94a3b8 ;
}
</style>