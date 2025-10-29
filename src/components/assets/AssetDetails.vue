<template>
  <v-container class="modern-container">
    <v-card class="modern-card" rounded="xl" elevation="8">
      <v-card-title class="modern-header">
        <v-icon start size="32">mdi-information-outline</v-icon>
        <span class="text-h5 font-weight-bold">Asset Details</span>
      </v-card-title>
      <v-divider class="my-4 border-opacity-100" color="teal-lighten-3" />

      <v-card-text v-if="assetDetails && assetDetails.length > 0">
        <v-data-table-virtual
          :headers="assetHeaders"
          :items="assetDetails"
          class="modern-table"
          hover
          density="comfortable"
          item-value="id"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              color="blue-grey"
              @click="openEditAssetDialog(item)"
            />
          </template>
        </v-data-table-virtual>
        <v-row class="mt-6">
          <v-col cols="12">
            <v-btn color="teal-darken-2" @click="$router.back()" class="back-btn" rounded="lg">
              <v-icon start>mdi-arrow-left</v-icon>
              Back to Asset List
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text v-else-if="isLoading">
        <v-overlay :model-value="isLoading" class="align-center justify-center">
          <v-progress-circular indeterminate color="teal" size="64"></v-progress-circular>
          <p class="text-h6 text-teal mt-4">Loading asset details...</p>
        </v-overlay>
      </v-card-text>

      <v-card-text v-else>
        <p class="text-h6 text-red-darken-2 text-center">Asset not found or an error occurred.</p>
      </v-card-text>
    </v-card>

    <!-- Update Asset Dialog -->
    <v-dialog v-model="dialogUpdateAsset" max-width="600px" persistent>
      <v-card rounded="xl">
        <v-card-title class="dialog-header bg-teal text-white">
          <v-icon start>mdi-pencil-box-outline</v-icon>
          Update Asset
        </v-card-title>
        <v-card-text class="pt-6">
            <v-select
              v-model="assetToUpdate.asset_name"
              :items="masterItems"
              item-title="name"
              item-value="name"
              label="Asset Name"
              variant="filled"
              rounded="lg"
              prepend-inner-icon="mdi-cube-outline"
              required
            />
            <v-select
              v-model="assetToUpdate.owner_name"
              :items="owners"
              item-title="name"
              item-value="id"
              label="Owner Name"
              variant="filled"
              rounded="lg"
              prepend-inner-icon="mdi-account-outline"
              required
            />
            <v-text-field
              v-model.number="assetToUpdate.quantity"
              label="Quantity"
              type="number"
              variant="filled"
              rounded="lg"
              prepend-inner-icon="mdi-counter"
              required
            />
            <v-text-field
              v-model.number="assetToUpdate.cogs"
              label="Cost of Goods"
              type="number"
              variant="filled"
              rounded="lg"
              prepend-inner-icon="mdi-cash-multiple"
              required
            />
            <v-text-field
              v-model.number="assetToUpdate.selling_price"
              label="Selling Price"
              type="number"
              variant="filled"
              rounded="lg"
              prepend-inner-icon="mdi-currency-usd"
              required
            />
            <v-textarea
              v-model="assetToUpdate.description"
              label="Description"
              variant="filled"
              rounded="lg"
              rows="3"
              prepend-inner-icon="mdi-note-text-outline"
            />
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn text @click="dialogUpdateAsset = false" rounded="lg">Cancel</v-btn>
          <v-btn color="teal" class="text-white" @click="updateAsset" :loading="isUpdatingAsset" rounded="lg">
            <v-icon left>mdi-content-save</v-icon>
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" location="top right" rounded="xl" elevation="12">
      <v-icon start>{{ snackbar.color === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline' }}</v-icon>
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { Asset } from '@/types/Asset';
import { LOAD_ASSET_DETAILS_BY_SUMMARY, UPDATE_ASSET, LOAD_OWNER, LOAD_MASTER_ITEM } from '@/store/storeconstant';

const route = useRoute();
const store = useStore();
const assetDetails = computed(() => store.state.asset.selectedAsset);
const owners = computed(() => store.state.asset.owners);
const masterItems = computed(() => store.state.masteritem.masteritems);
const isLoading = ref(true);

const ownerId = route.params.ownerId as string;
const assetName = route.params.assetName as string;
const assetHeaders = computed(() => [
  { title: 'Asset Name', value: 'asset_name' },
  { title: 'Owner Name', value: 'owner_name' },
  { title: 'Quantity', value: 'quantity' },
  { title: 'Cost of Goods', value: 'cogs' },
  { title: 'Selling Price', value: 'selling_price' },
  { title: 'Description', value: 'description' },
  { title: 'Actions', value: 'actions', sortable: false },
]);

const dialogUpdateAsset = ref(false);
const defaultAsset: Asset = {
  id: 0,
  asset_name: '',
  owner_name: '',
  quantity: 0,
  cogs: 0,
  selling_price: 0,
  description: '',
  created_by: '',
};
const assetToUpdate = reactive<Asset>(defaultAsset);
const isUpdatingAsset = ref(false);

const snackbar = reactive({
  show: false,
  message: '',
  color: '',
});

const showSnackbar = (message: string, color: string) => {
  snackbar.message = message;
  snackbar.color = color;
  snackbar.show = true;
};

const openEditAssetDialog = (asset: Asset) => {
  console.log("Opening edit dialog for asset:", asset);
  Object.assign(assetToUpdate, asset);
  dialogUpdateAsset.value = true;
};

const updateAsset = async () => {
  console.log("Attempting to update asset:", assetToUpdate);
  console.log("assetToUpdate.id:", assetToUpdate.id);
  if (!assetToUpdate.id) return;
  try {
    isUpdatingAsset.value = true;
    await store.dispatch(`asset/${UPDATE_ASSET}`, assetToUpdate);
    showSnackbar('Asset updated successfully!', 'success');
    dialogUpdateAsset.value = false;
    // Reload asset details after update
    await store.dispatch(`asset/${LOAD_ASSET_DETAILS_BY_SUMMARY}`, { ownerId, assetName });
  } catch (error) {
    showSnackbar('Failed to update asset.', 'error');
    console.error('Update failed:', error);
  } finally {
    isUpdatingAsset.value = false;
  }
};

onMounted(async () => {
  if (ownerId && assetName) {
    try {
      isLoading.value = true;
      await store.dispatch(`asset/${LOAD_ASSET_DETAILS_BY_SUMMARY}`, { ownerId, assetName });
      await store.dispatch(`asset/${LOAD_OWNER}`);
      await store.dispatch(`masteritem/${LOAD_MASTER_ITEM}`);
      console.log("Asset Details from Store:", assetDetails.value);
    } catch (error) {
      console.error('Failed to load asset details:', error);
    } finally {
      isLoading.value = false;
    }
  } else {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.modern-container {
  padding: 24px;
}

.modern-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05) !important;
}

.modern-header {
  background: linear-gradient(45deg, #009688 0%, #4DB6AC 100%);
  color: white;
  padding: 20px 24px;
  text-align: center;
  justify-content: center;
}

.modern-table {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.modern-table .v-data-table-header {
  background-color: #f9fafb;
  color: #37474f;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modern-table .v-data-table__tr:hover {
  background-color: #f0f4f8 !important;
}

.back-btn {
  background-color: #00897B !important;
  color: white !important;
  font-weight: 500;
}

.dialog-header {
  font-size: 1.25rem;
  font-weight: 600;
  padding: 16px 24px;
}
</style>