<template>
  <div :class="isDark ? 'stock-page-dark' : 'stock-page-light'">
    <v-container fluid class="stock-page-container">
      <v-row>
        <!-- Input Stock Card -->
        <v-col cols="12" md="3" class="pa-3">
          <v-card class="stock-card rounded-xl" elevation="6" :class="isDark ? 'stock-card-dark' : 'stock-card-light'">
            <v-card-title :class="isDark ? 'card-header-dark' : 'card-header-light'">
              <v-icon start>mdi-basket-fill</v-icon>
              <span class="text-h6 font-weight-bold">Input Stock</span>
            </v-card-title>
            <v-card-text class="pa-4">
              <v-autocomplete
                label="Item"
                v-model="selectedItem"
                :items="mItems"
                item-title="item_name"
                item-value="id"
                variant="outlined"
                rounded="lg"
                prepend-inner-icon="mdi-cube-outline"
                class="mb-3"
              />
              <v-text-field
                v-model.number="input"
                label="Stock Quantity"
                type="number"
                variant="outlined"
                rounded="lg"
                prepend-inner-icon="mdi-numeric"
                @keyup.enter="onCreateStock"
                class="mb-3"
              />
              <v-btn
                block
                class="stock-action-btn text-white"
                variant="elevated"
                size="large"
                rounded="lg"
                color="teal-darken-1"
                :disabled="isSaveDisabled"
                :loading="loadingCreateStock"
                @click="onCreateStock"
              >
                <v-icon start>mdi-plus</v-icon>
                Add Stock
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Current Stock Summary Card -->
        <v-col cols="12" md="8" class="pa-4">
          <v-card class="stock-card rounded-xl" elevation="6" :class="isDark ? 'stock-card-dark' : 'stock-card-light'">
            <v-card-title :class="isDark ? 'card-header-dark' : 'card-header-light'">
              <v-icon start>mdi-chart-bar</v-icon>
              <span class="text-h6 font-weight-bold">Current Stock Summary</span>
            </v-card-title>
            <v-card-text class="pa-4">
              <v-data-table-virtual
                :headers="headersStock"
                :items="stocks"
                :search="search"
                :loading="loading"
                loading-text="Loading stock data..."
                :class="isDark ? 'modern-table-dark' : 'modern-table-light'"
                fixed-header
                height="400px"
                hover
              >
                <template v-slot:[`item.no`]="{ index }">
                  {{ index + 1 }}
                </template>
                <template v-slot:[`item.cogs`]="{ item }">
                  {{ formatPrice(item.cogs) }}
                </template>
                <template v-slot:[`item.selling_price`]="{ item }">
                  {{ formatPrice(item.selling_price) }}
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                  <v-btn
                    icon="mdi-information-outline"
                    size="small"
                    variant="text"
                    :color="isDark ? 'cyan-accent-2' : 'blue-grey'"
                    :loading="loadingItemId === item.item_id"
                    @click="onLoadDetailStock(item.item_id)"
                  />
                </template>
              </v-data-table-virtual>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Stock Details Dialog -->
      <v-dialog v-model="DialogDetails" max-width="900px" persistent>
        <v-card class="stock-card rounded-xl" elevation="6" :class="isDark ? 'stock-card-dark' : 'stock-card-light'">
          <v-card-title :class="isDark ? 'card-header-dark' : 'card-header-light'">
            <v-icon start>mdi-format-list-bulleted</v-icon>
            <span class="text-h6 font-weight-bold">Stock Details</span>
          </v-card-title>
          <v-card-text class="pa-4">
            <v-data-table-virtual
              :headers="detailHeaders"
              :items="stockDetails.slice(0, 3)"
              :loading="loadingDetail"
              loading-text="Loading detail stock data..."
              :class="isDark ? 'modern-table-dark' : 'modern-table-light'"
              fixed-header
              height="300px"
              hover
            >
              <template v-slot:[`item.no`]="{ index }">
                {{ index + 1 }}
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  :color="isDark ? 'cyan-accent-2' : 'blue-grey'"
                  :loading="loadingActionUpdate === item.id"
                  @click="editStock(item)"
                />
              </template>
            </v-data-table-virtual>
          </v-card-text>
          <v-card-actions class="justify-end pa-4">
            <v-btn
              :color="isDark ? 'grey-lighten-1' : 'grey-darken-1'"
              variant="text"
              @click="closeStockDetail"
              rounded="lg"
              :loading="loadingCloseStockDetail"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Stock Update Dialog -->
      <v-dialog v-model="DialogUpdate" max-width="600px" persistent>
        <v-card class="stock-card rounded-xl" elevation="6" :class="isDark ? 'stock-card-dark' : 'stock-card-light'">
          <v-card-title :class="isDark ? 'card-header-dark' : 'card-header-light'">
            <v-icon start>mdi-update</v-icon>
            <span class="text-h6 font-weight-bold">Update Stock</span>
          </v-card-title>
          <v-card-text class="pa-4">
            <v-autocomplete
              label="Item"
              v-model="editedStock.item_id"
              :items="mItems"
              item-title="item_name"
              item-value="id"
              variant="outlined"
              rounded="lg"
              prepend-inner-icon="mdi-cube-outline"
              class="mb-3"
            />
            <v-text-field
              v-model.number="editedStock.stock"
              label="Stock Quantity"
              type="number"
              variant="outlined"
              rounded="lg"
              prepend-inner-icon="mdi-numeric"
              @keyup.enter="onUpdateStock"
              class="mb-3"
            />
          </v-card-text>
          <v-card-actions class="justify-end pa-4">
            <v-btn
              :color="isDark ? 'grey-lighten-1' : 'grey-darken-1'"
              variant="text"
              rounded="lg"
              :loading="loadingCloseUpdate"
              @click="closeUpdateStock"
            >
              Cancel
            </v-btn>
            <v-btn
              color="teal-darken-1"
              variant="elevated"
              class="text-white"
              @click="onUpdateStock"
              rounded="lg"
              :loading="loadingButtonUpdate"
            >
              <v-icon start>mdi-content-save</v-icon>
              Update Stock
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Error & Success Snackbars -->
      <SnackbarError :messages="validationErrorMessages" v-model="validationShowError" :timeout="2000" />
      <SnackbarSuccess v-model="hasSaved" message="Action completed successfully!" :timeout="2000" />

    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useTheme } from 'vuetify';
import { useMasterItem } from '@/composables/useMasterItem';
import { useStock } from '@/composables/useStock';
import { StockDetail } from '@/types';
import { useGlobal } from '@/composables/useGlobal';
import { SnackbarError, SnackbarSuccess } from '@/components/globalComponent';

  /* ======================================================*
   * COMPOSABLES                                           *
   * ======================================================*/
const {
  formatPrice,

  validationError,
  validationShowError,
  validationErrorMessages,
} = useGlobal();

const {
  DialogDetails,
  DialogUpdate,

  headersStock,
  detailHeaders,

  search,
  input,
  selectedItem,
  stocks,
  stockDetails,
  editedStock,

  loading,
  loadingDetail,
  hasSaved,

  createStock,
  updateStock,
  loadDetailStock,
  resetStockDetail,
  loadCurrentStock,
  resetEditedStock,
} = useStock();

const {
  mItems,
  loadMasterItem,
} = useMasterItem();

  /* ======================================================*
   * THEME                                                 *
   * ======================================================*/
const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const isSaveDisabled = computed(() => !(selectedItem.value && input.value));

  /* ======================================================*
   * HOOKS                                                 *
   * ======================================================*/
const loadingCreateStock = ref<boolean>(false);
const loadingItemId = ref<number | null>(null);
const loadingCloseStockDetail = ref<boolean>(false);
const loadingActionUpdate = ref<number | null>(null);
const loadingCloseUpdate = ref<boolean>(false);
const loadingButtonUpdate = ref<boolean>(false);

onMounted(() => {
  onLoadCurrentStock();
  onLoadMasterItem();
});

  /* ======================================================*
   * METHODS                                               *
   * ======================================================*/

const editStock = (item: StockDetail) => {
  Object.assign(editedStock, item);
  loadingActionUpdate.value = item.id;
  DialogUpdate.value = true;

  setTimeout(() => {
    loadingActionUpdate.value = null;
  }, 250);
};

const closeStockDetail = () => {
  loadingCloseStockDetail.value = true;

  setTimeout(() => {
    DialogDetails.value = false;
    loadingCloseStockDetail.value = false;
    resetStockDetail();
  }, 250);
};

const closeUpdateStock = () => {
  loadingCloseUpdate.value = true;
  setTimeout(() => {
    DialogUpdate.value = false;
    loadingCloseUpdate.value = false;
  }, 250);
};

const onCreateStock = async () => {
  loadingCreateStock.value = true;
  try {
    await createStock();
    resetEditedStock();
  } catch (e) {
    validationError(e);
  } finally {
    loadingCreateStock.value = false;
  }
};

const onLoadCurrentStock = async () => {
  resetStockDetail();
  try {
    await loadCurrentStock();
  } catch (e) {
    validationError(e);
  }
};

const onLoadMasterItem = async () => {
  try {
    await loadMasterItem();
  } catch (e) {
    validationError(e);
  }
};

const onLoadDetailStock = async (item_id: number) => {
  loadingItemId.value = item_id;
  try {
    await loadDetailStock(item_id);
    DialogDetails.value = true;
  } catch (e) {
    validationError(e);
  } finally {
    loadingItemId.value = null;
  }
};

const onUpdateStock = async () => {
  loadingButtonUpdate.value = true;
  const postData = editedStock;
  try {
    await updateStock(postData.id, postData.stock);
    DialogUpdate.value = false;
    await onLoadDetailStock(postData.item_id);
    await loadCurrentStock();
  } catch (e) {
    validationError(e);
  } finally {
    loadingButtonUpdate.value = false;
  }
};
</script>

<style scoped>
.stock-page-container {
  padding: 24px;
}

.stock-page-light {
  background-color: #f8fafc;
  min-height: 100vh;
}

.stock-page-dark {
  background-color: #121214;
  min-height: 100vh;
}

/* Cards */
.stock-card-light {
  background-color: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04) !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stock-card-dark {
  background-color: #1e1e24 !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stock-card-light:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
}

.stock-card-dark:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35) !important;
}

/* Card Headers */
.card-header-light {
  background: linear-gradient(45deg, #009688 0%, #4DB6AC 100%);
  color: white !important;
  padding: 16px 24px;
  font-size: 1.15rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.card-header-dark {
  background: linear-gradient(45deg, #00695C 0%, #00897B 100%);
  color: white !important;
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
}
.modern-table-light :deep(td) {
  color: #1e293b !important;
  font-size: 0.9rem;
  border-bottom: 1px solid #f1f5f9 !important;
}
.modern-table-light :deep(tbody tr:hover td) {
  background-color: #e0f2f7 !important;
}

/* Data Table Dark */
.modern-table-dark {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
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
}
.modern-table-dark :deep(td) {
  color: #f1f5f9 !important;
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}
.modern-table-dark :deep(tbody tr:hover td) {
  background-color: rgba(0, 188, 212, 0.12) !important;
}

/* Buttons */
.stock-action-btn {
  font-weight: bold;
  letter-spacing: 0.5px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.stock-action-btn:hover {
  transform: translateY(-2px);
}

/* Form Controls Adjustments for Dark Mode */
.stock-page-dark :deep(.v-field__input) {
  color: #ffffff !important;
}
.stock-page-dark :deep(.v-field__outline) {
  color: rgba(255, 255, 255, 0.18) !important;
}
.stock-page-dark :deep(.v-field--focused .v-field__outline) {
  color: #00bcd4 !important;
}
.stock-page-dark :deep(.v-label) {
  color: #94a3b8 !important;
}
.stock-page-dark :deep(.v-messages) {
  color: #94a3b8 !important;
}
</style>