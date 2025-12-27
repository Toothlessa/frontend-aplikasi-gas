<template>
  <v-container class="modern-container">
    <v-card class="modern-card" rounded="xl" elevation="8">
      <v-card-title class="modern-header">
        <v-icon start size="32">mdi-information-outline</v-icon>
        <span class="text-h5 font-weight-bold">Asset Details</span>
      </v-card-title>
      <v-divider class="my-4 border-opacity-100" color="teal-lighten-3" />

      <!-- LOADING -->
      <template v-if="loading">
        <v-card class="rounded-xl pa-4">
          <v-skeleton-loader type="heading, text" />
        </v-card>
      </template>

      <template v-else>
        <v-card-text>
          <v-data-table-virtual
            :headers="headerAssetDetail"
            :items="assetDetails"
            :loading="loadingButtonCreate"
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

            <template v-slot:[`item.selling_price`]="{ value }">
              {{ formatPrice(value) }}
            </template>

            <template v-slot:[`item.cogs`]="{ value }">
              {{ formatPrice(value) }}
            </template>
          </v-data-table-virtual>
          <v-row class="mt-6">
            <v-col cols="12">
              <v-btn
                color="teal-darken-2"
                @click="goBack"
                class="back-btn"
                rounded="lg"
                :loading="isNavigatingBack"
              >
                <v-icon start>mdi-arrow-left</v-icon>
                Back to Asset List
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </template>

    </v-card>

    <!-- Update Asset Dialog -->
    <v-dialog v-model="dialogUpdateAssetDetail" max-width="600px" persistent>
      <v-card rounded="xl">
        <v-card-title class="dialog-header bg-teal text-white">
          <v-icon start>mdi-pencil-box-outline</v-icon>
          Update Asset
        </v-card-title>
        <v-card-text class="pt-6">
            <v-autocomplete
              v-model="assetToUpdate.item_id"
              :items="mItems"
              item-title="item_name"
              item-value="id"
              label="Asset Name"
              variant="filled"
              rounded="lg"
              prepend-inner-icon="mdi-cube-outline"
              required
            />
            <v-autocomplete
              v-model="assetToUpdate.owner_id"
              :items="assetOwners"
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
          <v-btn @click="dialogUpdateAssetDetail = false" rounded="lg">Cancel</v-btn>
          <v-btn color="teal" class="text-white" @click="updateAsset" :loading="loadingButtonCreate" rounded="lg">
            <v-icon left>mdi-content-save</v-icon>
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="hasSaved"
      color="success"
      location="top right"
      rounded="xl"
      elevation="12"
    >
      <v-icon start>mdi-check-circle-outline</v-icon>
      Data has been saved successfully.
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Asset } from '@/types/Asset';
import { useAsset } from '@/composables/useAsset';
import { useGlobal } from '@/composables/useGlobal';
import { useMasterItem } from '@/composables/useMasterItem';
import { useRoute } from 'vue-router';

  /* -----------------------------------------------------*
   * COMPOSABLES                                          *
   * ---------------------------------------------------- */
const {

  formatPrice,
} = useGlobal();

const {
  mItems,

  loadMasterItem,
} = useMasterItem();

const {
  headerAssetDetail,
  
  loading,
  assetToUpdate,

  //vuex
  createAsset,
  loadAssetDetail,
  loadOwners,

  isNavigatingBack,
  goBack,

  hasSaved,
  loadingButtonCreate,

  assetOwners,
  assetDetails,
} = useAsset();

  /* -----------------------------------------------------*
   * CONSTANT                                             *
   * ---------------------------------------------------- */

const route = useRoute();
const dialogUpdateAssetDetail = ref(false);
const owner_id = Number(route.params.owner_id);
const item_id  = Number(route.params.item_id);

  /* -----------------------------------------------------*
   * LIFECYCLE HOOKS                                      *
   * ---------------------------------------------------- */

onMounted(() => {
  loadAssetDetail(owner_id, item_id);
  loadOwners();
  loadMasterItem();
});

 /* ------------------------------------------------------*
   * FUNCTIONS                                            *
   * ---------------------------------------------------- */

const openEditAssetDialog = (asset: Asset) => {
  dialogUpdateAssetDetail.value = true;
  Object.assign(assetToUpdate, asset);
};

const updateAsset = async () => {
  try {
    await createAsset(assetToUpdate);
    await loadAssetDetail(assetToUpdate.owner_id, assetToUpdate.item_id);
    dialogUpdateAssetDetail.value = false;
    
  } catch (error) {
    console.error('Update failed:', error);
  } 
};

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