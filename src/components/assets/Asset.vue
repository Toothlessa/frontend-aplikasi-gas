
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
          <v-form @submit.prevent="onCreateAsset">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="assetData.item_id"
                  :items="mItems"
                  item-title="item_name"
                  item-value="id"
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
                    v-model="assetData.owner_id"
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
                      @click="dialogOwner = true"
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
                  v-model.number="assetData.quantity"
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
                  v-model.number="assetData.cogs"
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
                  v-model.number="assetData.selling_price"
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
              v-model="assetData.description"
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
              :loading="loadingButtonCreate"
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
            :headers="headerAsset"
            :items="assets"
            :loading="loading"
            class="modern-table"
            hover
          >
           <!-- Actions -->
            <template #[`item.actions`]="{ item }">
              <div class="action-buttons">
                <v-tooltip text="Details" location="top">
                  <template #activator="{ props }">
                    <v-btn 
                      v-bind="props" 
                      icon 
                      variant="text" 
                      :loading="loadingDetailKey === `${item.owner_id}-${item.item_id}`" 
                      @click="goToAssetDetails(item.owner_id, item.item_id)">
                      <v-icon size="22">mdi-information-outline</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </div>
            </template>

            <template #[`item.cogs`]="{ item }">
              {{ formatPrice(item.cogs) }}
            </template>

            <template #[`item.selling_price`]="{ item }">
              {{ formatPrice(item.selling_price) }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>

      <!-- Dialogs -->
      <DialogOwner
        :dialog="dialogOwner"
        :headers="headerOwner"
        :owners="assetOwners"
        @close="dialogOwner = false"
      />

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
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { headerOwner } from '@/types/Asset';
import DialogOwner from './DialogOwner.vue';
import { useAsset } from '@/composables/useAsset';
import { useMasterItem } from '@/composables/useMasterItem';
import { useGlobal } from '@/composables/useGlobal';

  /* -----------------------------------------------------*
   * COMPOSABLES                                          *
   * ---------------------------------------------------- */
  const {
    //ultilities
    formatPrice,

    //helpers 
    //error helpers
    handleError,
  } = useGlobal();

  const {
    dialogOwner,

    //table
    headerAsset,

    assetData,

    hasSaved,

    //computed
    resetAssetForm,
    assetOwners,
    assets,
    loading,
    loadingButtonCreate,

    //vuex
    loadAssets,
    loadOwners,
    createAsset,
    
    loadingDetailKey,
    goToAssetDetails,

  } = useAsset();

  const {
    mItems,
    loadMasterItem,
  } = useMasterItem();

  /* -----------------------------------------------------*
   * LIFECYCLE HOOKS                                      *
   * ---------------------------------------------------- */
  onMounted(() => {
    loadMasterItem();
    loadAssets();
    loadOwners();
  });

 /* ------------------------------------------------------*
   * FUNCTIONS                                            *
   * ---------------------------------------------------- */
const onCreateAsset = async () => {
  try {
    await createAsset(assetData);
    await loadAssets();
    resetAssetForm();
  } catch (error) {
    handleError(error); 
  }
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
