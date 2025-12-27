<template>
  <v-container fluid class="stock-page-container">
    <v-row>
      <!-- Input Stock Card -->
      <v-col cols="12" md="3" class="pa-3">
        <v-card class="stock-card" rounded="xl" elevation="6">
          <v-card-title class="stock-card-header">
            <v-icon start>mdi-basket-fill</v-icon>
            <span class="text-h6 font-weight-bold">Input Stock</span>
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
              :loading="loadingButton"
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
        <v-card class="stock-card" rounded="xl" elevation="6">
          <v-card-title class="stock-card-header">
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
                  @click="getStockDetail(item.item_id)"
                />
              </template>
            </v-data-table-virtual>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Stock Details Dialog -->
    <v-dialog v-model="DialogDetails" max-width="900px" rounded="xl" persistent>
      <v-card class="stock-card" rounded="xl" elevation="6">
        <v-card-title class="stock-card-header">
          <v-icon start>mdi-format-list-bulleted</v-icon>
          <span class="text-h6 font-weight-bold">Stock Details</span>
        </v-card-title>
        <v-card-text class="pa-4">
          <v-data-table-virtual
            :headers="detailHeaders"
            :items="stockDetails.slice(0, 3)"
            :loading="loadingDetail"
            loading-text="Loading detail stock data..."
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
                @click="editStock(item)"
              />
            </template>
          </v-data-table-virtual>
        </v-card-text>
        <v-card-actions class="justify-end pa-4">
          <v-btn color="grey-darken-1" variant="text" @click="DialogDetails = false" rounded="lg">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Stock Update Dialog -->
    <v-dialog v-model="DialogUpdate" max-width="600px" rounded="xl" persistent>
      <v-card class="stock-card" rounded="xl" elevation="6">
        <v-card-title class="stock-card-header">
          <v-icon start>mdi-update</v-icon>
          <span class="text-h6 font-weight-bold">Update Stock</span>
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
            @keyup.enter="updateStock"
            class="mb-3"
          />
        </v-card-text>
        <v-card-actions class="justify-end pa-4">
          <v-btn color="grey-darken-1" variant="text" @click="DialogUpdate = false" rounded="lg">
            Cancel
          </v-btn>
          <v-btn color="teal-darken-1" variant="elevated" @click="updateStock" rounded="lg">
            <v-icon start>mdi-content-save</v-icon>
            Update Stock
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="hasSaved"
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
import { computed, onMounted } from 'vue';
import store from '@/store/store';
import { LOAD_DETAIL_STOCK, UPDATE_STOCK } from '@/store/storeconstant';
import { useMasterItem } from '@/composables/useMasterItem';
import { useStock } from '@/composables/useStock';
import { StockDetail } from '@/types';
import { useGlobal } from '@/composables/useGlobal';

 /* ======================================================*
  * COMPOSABLES                                           *
  * ======================================================*/
const {
  formatPrice,

  handleError,
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

  loadingButton,
  loading,
  loadingDetail,
  hasSaved,

  alert,
  error,

  createStock,
  loadCurrentStock,
  resetEditedStock,
  // handleError,
} = useStock();

const {
  mItems,
  loadMasterItem,
} = useMasterItem();

const isSaveDisabled = computed(() => !(selectedItem.value && input.value));

 /* ======================================================*
  * HOOKS                                                 *
  * ======================================================*/
onMounted(() => {
  loadCurrentStock();
  loadMasterItem();
});

 /* ======================================================*
  * METHODS                                               *
  * ======================================================*/

const editStock = (item: StockDetail) => {
  Object.assign(editedStock, item);
  DialogUpdate.value = true;
};

// async function create() {
//   try {
//     await store.dispatch(`stock/${CREATE_STOCK}`, { itemId: selectedItem.value, stock: { stock: input.value} });
//     resetEditedStock();
//   } catch(error) {
//      handleError(error);
//   }
// }

const onCreateStock = async() => {
  try {
    await createStock();
    resetEditedStock();
  } catch(error) {
    handleError(error);
  }
}

async function getStockDetail(itemId: number) {
  try {
    DialogDetails.value = true;
    await store.dispatch(`stock/${LOAD_DETAIL_STOCK}`, itemId);
  } catch(error) {
    handleError(error);
  } 
}

async function updateStock() {
  const postData = editedStock;
  try {
    await store.dispatch(`stock/${UPDATE_STOCK}`, { id: postData.id, stock: postData});
    DialogUpdate.value = false;
    await getStockDetail(postData.item_id);
    await loadCurrentStock();

  } catch(error) {
    handleError(error);
  }
}

</script>

<style scoped>
.stock-page-container {
  padding: 24px;
  background-color: #f0f2f5; /* Light gray background for the page */
  min-height: 100vh;
}

.stock-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05) !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stock-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
}

.stock-card-header {
  background: linear-gradient(45deg, #009688 0%, #4DB6AC 100%); /* Teal gradient */
  color: white;
  padding: 16px 24px;
  font-size: 1.25rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}

.stock-card-header .v-icon {
  margin-right: 8px;
}

.stock-action-btn {
  font-weight: bold;
  letter-spacing: 0.5px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.stock-action-btn:hover {
  transform: translateY(-2px);
}

.modern-data-table {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.modern-data-table :deep(th) {
  background-color: #f5f5f5 !important; /* Light grey header background */
  color: #37474f !important; /* Darker text for contrast */
  font-weight: bold !important;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.modern-data-table :deep(td) {
  font-size: 0.9rem;
  color: #424242;
}

.modern-data-table :deep(tr:hover) {
  background-color: #e0f2f7 !important; /* Light cyan on hover */
}

.stock-dialog-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.v-alert {
  border-radius: 8px;
}

.v-text-field .v-input__control {
  border-radius: 8px;
}

.v-autocomplete .v-input__control {
  border-radius: 8px;
}

.v-btn.stock-action-btn {
  background-color: #00BFA5 !important; /* Accent teal for buttons */
}

.v-btn.stock-action-btn:hover {
  background-color: #00897B !important;
}

.v-btn.back-btn {
  background-color: #607D8B !important; /* Blue-grey for back button */
}

.v-btn.back-btn:hover {
  background-color: #455A64 !important;
}
</style>
