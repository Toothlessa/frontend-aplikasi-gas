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
              @keyup.enter="inputStock"
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
              @click="inputStock"
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
              :headers="headers"
              :items="stocks"
              :search="search"
              :loading="loadingData"
              loading-text="Loading stock data..."
              class="modern-data-table"
              fixed-header
              height="400px"
              hover
            >
              <template v-slot:[`item.action`]="{ item }">
                <v-btn
                  icon="mdi-information-outline"
                  size="small"
                  variant="text"
                  color="blue-grey"
                  @click="detailsStock(item)"
                />
              </template>
            </v-data-table-virtual>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Stock Details Dialog -->
    <v-dialog v-model="dialogDetails" max-width="900px" rounded="xl">
      <v-card class="stock-dialog-card">
        <v-card-title class="stock-card-header">
          <v-icon start>mdi-format-list-bulleted</v-icon>
          <span class="text-h6 font-weight-bold">Stock Details</span>
        </v-card-title>
        <v-card-text class="pa-4">
          <v-data-table-virtual
            :headers="detailHeaders"
            :items="detailStock.slice(0, 3)"
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
          <v-btn color="grey-darken-1" variant="text" @click="dialogDetails = false" rounded="lg">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Stock Update Dialog -->
    <v-dialog v-model="dialogUpdate" max-width="600px" rounded="xl">
      <v-card class="stock-dialog-card">
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
          <v-btn color="grey-darken-1" variant="text" @click="dialogUpdate = false" rounded="lg">
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

interface Stock {
  item_name: string;
  item_code: string;
  category: string;
  cogs: number;
  selling_price: number;
  total_stock: number;
  item_id: number;
}

interface MasterItem {
  id: number;
  item_name: string;
}

interface DetailStock {
  id: number;
  item_name: string;
  item_code: string;
  category: string;
  stock: number;
  created_at: string;
}

const search = ref('');
const headers = [
  { align: 'start', key: 'item_name', title: 'Nama Barang' },
  { key: 'item_code', title: 'Kode Barang' },
  { key: 'category', title: 'Kategori' },
  { key: 'cogs', title: 'Harga Modal', align: 'center' },
  { key: 'selling_price', title: 'Harga Jual', align: 'center' },
  { key: 'total_stock', title: 'Running Stock', align: 'center' },
  { key: 'action', title: 'Details', sortable: false },
];

const detailHeaders = [
  { title: 'No', key: 'id' },
  { title: 'Item Name', key: 'item_name' },
  { title: 'Item Code', key: 'item_code' },
  { title: 'Category', key: 'category' },
  { title: 'Stock Input', key: 'stock' },
  { title: 'Date', key: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const selectedItem = ref<number | null>(null);
const input = ref('');
const hasSaved = ref(false);
const dialogDetails = ref(false);
const dialogUpdate = ref(false);
const loadingData = ref(true);
const loadingButton = ref(false);
const alert = ref(false);
const error = ref('');
const stocks = ref<Stock[]>([]);
const mItems = ref<MasterItem[]>([]);
const detailStock = ref<DetailStock[]>([]);

const editedStock = reactive({
  item_id: null as number | null,
  stock: null as number | null,
  id: null as number | null,
});

const isSaveDisabled = computed(() => !(selectedItem.value && input.value));

const getMasterItem = async () => {
  try {
    const response = await AxiosInstance.get<{ data: MasterItem[] }>(`http://127.0.0.1:8000/api/masteritems/itemtype/ITEM`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
      },
    });
    if (response.status === 200) {
      mItems.value = response.data.data;
    }
  } catch (err) {
    const axiosError = err as { response?: { data?: { errors?: string[] } } };
    error.value = Validations.getErrorMessageFromCode(axiosError.response?.data?.errors?.[0]);
    alert.value = true;
  }
};

const getCurrentStockSummary = async () => {
  try {
    const response = await AxiosInstance.get<{ data: Stock[] }>(`http://127.0.0.1:8000/api/stockitems/currentstock`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
      },
    });
    if (response.status === 200) {
      stocks.value = response.data.data;
      loadingData.value = false;
    }
  } catch (err) {
    const axiosError = err as { response?: { data?: { errors?: string[] } } };
    error.value = Validations.getErrorMessageFromCode(axiosError.response?.data?.errors?.[0]);
    alert.value = true;
  }
};

const inputStock = async () => {
  loadingButton.value = true;
  const postData = {
    stock: input.value,
  };
  try {
    const response = await AxiosInstance.post(`http://127.0.0.1:8000/api/stockitems/${selectedItem.value}`, postData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
      },
    });
    if (response.status === 201) {
      hasSaved.value = true;
      selectedItem.value = null;
      input.value = '';
      await getCurrentStockSummary();
    }
  } catch (err) {
    const axiosError = err as { response?: { data?: { errors?: string[] } } };
    error.value = Validations.getErrorMessageFromCode(axiosError.response?.data?.errors?.[0]);
    alert.value = true;
  } finally {
    loadingButton.value = false;
  }
};

const detailsStock = async (item: Stock) => {
  Object.assign(editedStock, item);
  try {
    const response = await AxiosInstance.get<{ data: DetailStock[] }>(`http://127.0.0.1:8000/api/stockitems/detailstock/${editedStock.item_id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
      },
    });
    if (response.status === 200) {
      detailStock.value = response.data.data;
    }
  } catch (err) {
    const axiosError = err as { response?: { data?: { errors?: string[] } } };
    error.value = Validations.getErrorMessageFromCode(axiosError.response?.data?.errors?.[0]);
    alert.value = true;
  }
  dialogDetails.value = true;
};

const editStock = (item: DetailStock) => {
  Object.assign(editedStock, item);
  dialogUpdate.value = true;
};

const updateStock = async () => {
  const postData = editedStock;
  try {
    const response = await AxiosInstance.put(`http://127.0.0.1:8000/api/stockitems/${editedStock.id}`, postData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
      },
    });
    if (response.status === 200) {
      await detailsStock(postData as Stock);
      await getCurrentStockSummary();
      hasSaved.value = true;
    }
  } catch (err) {
    const axiosError = err as { response?: { data?: { errors?: string[] } } };
    error.value = Validations.getErrorMessageFromCode(axiosError.response?.data?.errors?.[0]);
    alert.value = true;
  }
  dialogUpdate.value = false;
};

onMounted(() => {
  getMasterItem();
  getCurrentStockSummary();
});
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
