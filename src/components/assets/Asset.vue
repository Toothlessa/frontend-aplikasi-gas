
<template>
  <div class="modern-layout">
    <v-container>
      <!-- Header -->
      <v-sheet
        class="page-header"
        elevation="4"
        rounded="xl"
      >
        <v-row align="center" class="pa-2">
          <v-col cols="auto">
            <v-avatar color="white" size="48">
              <v-icon icon="mdi-database-cog-outline" color="teal-darken-2" size="40" />
            </v-avatar>
          </v-col>
          <v-col>
            <h1 class="text-h4 font-weight-bold text-white">
              Asset Management
            </h1>
            <p class="text-subtitle-1 text-white mt-1" style="opacity: 0.9;">
              Streamline your asset tracking and management
            </p>
          </v-col>
        </v-row>
      </v-sheet>

      <!-- Create Asset Form -->
      <v-card class="form-card mt-8 pa-4" elevation="2" rounded="xl">
        <v-card-title class="text-h6 font-weight-medium text-grey-darken-3">
          <v-icon start color="teal">mdi-plus-circle-outline</v-icon>
          Create New Asset
        </v-card-title>
        <v-card-text class="pt-4">
          <v-form @submit.prevent="createAsset">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newAsset.asset_name"
                  :items="mItems"
                  item-title="item_name"
                  label="Asset Name"
                  variant="filled"
                  rounded="lg"
                  prepend-inner-icon="mdi-cube-outline"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <div class="d-flex align-center">
                  <v-select
                    v-model="newAsset.owner_id"
                    :items="assetOwners"
                    item-title="name"
                    item-value="id"
                    label="Owner"
                    variant="filled"
                    rounded="lg"
                    prepend-inner-icon="mdi-account-outline"
                    required
                    class="flex-grow-1"
                  />
                  <v-tooltip text="Create Owner" location="top">
                    <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      @click="openDialogOwner = true; isEdit = false; newOwnerData = {};"
                      variant="text"
                      class="ml-3"
                      icon="mdi-plus-circle-outline"
                    />
                    </template>
                  </v-tooltip>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="newAsset.quantity"
                  label="Quantity"
                  type="number"
                  variant="filled"
                  rounded="lg"
                  prepend-inner-icon="mdi-counter"
                  required
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="newAsset.cogs"
                  label="Cost of Goods"
                  type="number"
                  variant="filled"
                  rounded="lg"
                  prepend-inner-icon="mdi-cash-multiple"
                  required
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="newAsset.selling_price"
                  label="Selling Price"
                  type="number"
                  variant="filled"
                  rounded="lg"
                  prepend-inner-icon="mdi-currency-usd"
                  required
                />
              </v-col>
            </v-row>
            <v-textarea
              v-model="newAsset.description"
              label="Description"
              variant="filled"
              rounded="lg"
              rows="3"
              prepend-inner-icon="mdi-note-text-outline"
            />
            <v-btn
              type="submit"
              color="teal"
              class="mt-4 text-white"
              :loading="isCreatingAsset"
              block
              rounded="xl"
              size="large"
            >
              <v-icon left>mdi-plus</v-icon>
              Create Asset
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>

      <!-- Asset List -->
      <v-card class="list-card mt-8" elevation="2" rounded="xl">
        <v-card-title class="text-h6 font-weight-medium text-grey-darken-3 pa-4">
          <v-icon start color="teal">mdi-format-list-bulleted</v-icon>
          Asset Inventory
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-data-table
            :headers="assetHeaders"
            :items="assets"
            :loading="isLoadingAssets"
            class="modern-table"
            hover
          >
           <!-- Actions -->
            <template #[`item.actions`]="{ item }">
              <div class="action-buttons">
                <v-tooltip text="Details" location="top">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon variant="text" @click="goToAssetDetails(item.owner_id, item.asset_name)">
                      <v-icon size="22">mdi-information-outline</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>

      <!-- Dialogs -->
      <DialogOwner
        :dialog="openDialogOwner"
        :headers="headerOwner"
        :owners="assetOwners"
        :newOwner="newOwnerData"
        :search="searchQuery"
        :loading="isLoadingOwners"
        @close="openDialogOwner = false"
        @submit="handleCreateOwner"
        @update:search="searchQuery = $event"
        @updateOwner="onUpdateOwner"
      />

      

      <!-- Snackbar for notifications -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" location="top right" rounded="xl" elevation="12">
        <v-icon start>{{ snackbar.color === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline' }}</v-icon>
        {{ snackbar.message }}
      </v-snackbar>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { Asset, Owner } from '@/types/asset';
import {
  CREATE_ASSET,
  LOAD_ASSET,
  CREATE_OWNER,
  LOAD_OWNER,
  LOAD_MASTER_ITEM,
} from '@/store/storeconstant';
import DialogOwner from './DialogOwner.vue';
import { MasterItem } from '@/types';

// --- Refs and Reactive State ---
const store = useStore();
const router = useRouter();
const newAsset = reactive<Omit<Asset, 'id'>>({
  asset_name: '',
  owner_id: '',
  quantity: 0,
  cogs: 0,
  selling_price: 0,
  description: '',
});

const newOwnerData = ref<Partial<Owner>>({});
const isEdit = ref(false);

const openDialogOwner = ref(false);

const isCreatingAsset = ref(false);
const isUpdatingAsset = ref(false);
const isLoadingAssets = ref(false);
const isLoadingOwners = ref(false);
const searchQuery = ref('');

const snackbar = reactive({
  show: false,
  message: '',
  color: '',
});

// --- Computed Properties ---
const mItems = computed<MasterItem[]>(() => store.state.masteritem.mItems);
const assetOwners = computed<Owner[]>(() => store.state.asset.owners);
const assets = computed<Asset[]>(() => store.state.asset.assets);

// --- Data Table Headers ---
const assetHeaders = [
  { title: 'Name', value: 'asset_name', sortable: true, class: 'text-subtitle-1' },
  { title: 'Owner', value: 'owner_name', sortable: true, class: 'text-subtitle-1' },
  { title: 'Quantity', value: 'quantity', sortable: true, class: 'text-subtitle-1' },
  { title: 'Cost', value: 'cogs', sortable: true, class: 'text-subtitle-1' },
  { title: 'Price', value: 'selling_price', sortable: true, class: 'text-subtitle-1' },
  { title: 'Actions', value: 'actions', sortable: false, align: 'center', class: 'text-subtitle-1' },
];

const loadMasterItem = () => store.dispatch(`masteritem/${LOAD_MASTER_ITEM}`);
const loadAssets = () => store.dispatch(`asset/${LOAD_ASSET}`);
const loadOwners = () => store.dispatch(`asset/${LOAD_OWNER}`);
// --- Lifecycle Hooks ---
onMounted(() => {
  loadMasterItem();
  loadAssets();
  loadOwners();
});

const createAsset = async () => {
  try {
    isCreatingAsset.value = true;
    await store.dispatch(`asset/${CREATE_ASSET}`, newAsset);
    showSnackbar('Asset created successfully!', 'success');
    resetAssetForm();
  } catch (error) {
    showSnackbar('Failed to create asset.', 'error');
  } finally {
    isCreatingAsset.value = false;
  }
};

// const openUpdateAssetDialog = (asset: Asset) => {
//   assetToUpdate.value = { ...asset };
//   dialogUpdateAsset.value = true;
// };

const goToAssetDetails = (ownerId: string, assetName: string) => {
  router.push({ name: 'AssetDetails', params: { ownerId, assetName } });
};

const onUpdateOwner = (item: Owner) => {
  newOwnerData.value = { ...item }; // Set item to pass to the dialog
};

const handleCreateOwner = async (ownerData: Partial<Owner>) => {
  try {
    // await store.dispatch(CREATE_OWNER, ownerData);
    await store.dispatch(`asset/${CREATE_OWNER}`, ownerData);
    showSnackbar('Owner created successfully!', 'success');
    openDialogOwner.value = false;
  } catch (error) {
    showSnackbar('Failed to create owner.', 'error');
  }
};


const resetAssetForm = () => {
  Object.assign(newAsset, {
    asset_name: '',
    owner_id: '',
    quantity: 0,
    cogs: 0,
    selling_price: 0,
    description: '',
  });
};

const updateAsset = async () => {
  // Placeholder for update logic
  try {
    isUpdatingAsset.value = true;
    // await store.dispatch(`asset/${UPDATE_ASSET}`, assetToUpdate.value);
    showSnackbar('Asset updated successfully!', 'success');
  } catch (error) {
    showSnackbar('Failed to update asset.', 'error');
  } finally {
    isUpdatingAsset.value = false;
  }
};

const showSnackbar = (message: string, color: string) => {
  snackbar.message = message;
  snackbar.color = color;
  snackbar.show = true;
};
</script>

<style scoped>
.modern-layout {
  background-color: #f4f6f8;
}

.page-header {
  background: linear-gradient(45deg, #009688 0%, #4DB6AC 100%);
  color: white;
}

.form-card, .list-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  transition: box-shadow 0.3s ease-in-out;
}

.form-card:hover, .list-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
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
  background-color: #f0f4f8 !important;
}

.dialog-header {
  font-size: 1.25rem;
  font-weight: 600;
  padding: 16px 24px;
}
</style>
