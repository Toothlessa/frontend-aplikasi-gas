<template>
  <div :class="isDark ? 'modern-layout-dark' : 'modern-layout-light'">
    <v-container>
      <!-- Header -->
      <v-sheet
        class="page-header"
        elevation="3"
        rounded="xl"
        :class="isDark ? 'page-header-dark' : 'page-header-light'"
      >
        <v-row align="center" class="pa-2">
          <v-col cols="auto">
            <v-avatar color="white" size="48">
              <v-icon icon="mdi-database-cog-outline" color="teal-darken-2" size="36" />
            </v-avatar>
          </v-col>
          <v-col>
            <h1 class="text-h5 font-weight-bold text-white">
              Asset Management
            </h1>
            <p class="text-body-2 text-white mt-1" style="opacity: 0.9;">
              Streamline your asset tracking and management
            </p>
          </v-col>
        </v-row>
      </v-sheet>

      <!-- Create Asset Form -->
      <v-card class="form-card mt-8 pa-4" elevation="2" rounded="xl" :class="isDark ? 'form-card-dark' : 'form-card-light'">
        <v-card-title class="text-h6 font-weight-medium" :class="isDark ? 'text-white' : 'text-grey-darken-3'">
          <v-icon start :color="isDark ? 'teal-accent-3' : 'teal'">mdi-plus-circle-outline</v-icon>
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
                      :color="isDark ? 'teal-accent-3' : 'teal-darken-1'"
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
      <v-card class="list-card mt-8" elevation="2" rounded="xl" :class="isDark ? 'list-card-dark' : 'list-card-light'">
        <v-card-title class="text-h6 font-weight-medium pa-4" :class="isDark ? 'text-white' : 'text-grey-darken-3'">
          <v-icon start :color="isDark ? 'teal-accent-3' : 'teal'">mdi-format-list-bulleted</v-icon>
          Asset Inventory
        </v-card-title>
        <v-divider :style="isDark ? 'border-color: rgba(255,255,255,0.08);' : ''" />
        <v-card-text class="pa-4">
          <v-data-table
            :headers="headerAsset"
            :items="assets"
            :loading="loading"
            :class="isDark ? 'modern-table-dark' : 'modern-table-light'"
            hover
          >
            <template #[`item.cogs`]="{ item }">
              {{ formatPrice(item.cogs) }}
            </template>
            <template #[`item.selling_price`]="{ item }">
              {{ formatPrice(item.selling_price) }}
            </template>
            <!-- Actions -->
            <template #[`item.actions`]="{ item }">
              <div class="action-buttons">
                <v-tooltip text="Details" location="top">
                  <template #activator="{ props }">
                    <v-btn 
                      v-bind="props" 
                      icon 
                      variant="text" 
                      :color="isDark ? 'teal-accent-3' : 'teal-darken-2'"
                      :loading="loadingDetailKey === `${item.owner_id}-${item.item_id}`" 
                      @click="goToAssetDetails(item.owner_id, item.item_id)">
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
        :dialog="dialogOwner"
        :headers="headerOwner"
        :owners="assetOwners"
        @close="dialogOwner = false"
      />

      <!-- Snackbar -->
      <SnackbarSuccess v-model="hasSaved" message="Action completed successfully!" :timeout="2000"/>
      <SnackbarError v-model="validationShowError" :messages="validationErrorMessages" :timeout="2000"/>

    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { headerOwner } from '@/types/Asset';
import DialogOwner from './DialogOwner.vue';
import { useAsset } from '@/composables/useAsset';
import { useMasterItem } from '@/composables/useMasterItem';
import { useGlobal } from '@/composables/useGlobal';
import { useTheme } from 'vuetify/lib/framework.mjs';
import { SnackbarError, SnackbarSuccess } from '../globalComponent';

  /* -----------------------------------------------------*
   * COMPOSABLES                                          *
   * ---------------------------------------------------- */
  const theme = useTheme();
  const isDark = computed(() => theme.global.current.value.dark);

  const {
    //ultilities
    formatPrice,
    //validation helpers
    validationErrorMessages,
    validationShowError,
    validationError,
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
    //loading
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
    onLoadMasterItem();
    onLoadAssets();
    onLoadOwners();
  });

/* ------------------------------------------------------*
  * FUNCTIONS                                            *
  * ---------------------------------------------------- */

const onCreateAsset = async () => {
  try {
    await createAsset(assetData);
    await loadAssets();
    resetAssetForm();
  } catch (e) {
   validationError(e);
  }
};

const onLoadAssets = async () => {
  try {
    await loadAssets();
  } catch (e) {
    validationError(e);
  }
};

const onLoadOwners = async () => {
  try {
    await loadOwners();
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

</script>

<style scoped>
.modern-layout-light {
  background-color: #f8fafc;
  min-height: 100vh;
}

.modern-layout-dark {
  background-color: #121214;
  min-height: 100vh;
}

.page-header-light {
  background: linear-gradient(135deg, #009688 0%, #26A69A 100%);
  color: white;
}

.page-header-dark {
  background: linear-gradient(135deg, #00695C 0%, #00897B 100%);
  color: white;
}

/* Card Styles */
.form-card-light, .list-card-light {
  background-color: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04) !important;
  transition: box-shadow 0.25s ease;
}

.form-card-dark, .list-card-dark {
  background-color: #1e1e24 !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
  transition: box-shadow 0.25s ease;
}

.form-card-light:hover, .list-card-light:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
}

.form-card-dark:hover, .list-card-dark:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35) !important;
}

/* Table Light */
.modern-table-light {
  border-radius: 12px;
  overflow: hidden;
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
  padding: 12px 16px !important;
}
.modern-table-light :deep(td) {
  color: #1e293b !important;
  padding: 12px 16px !important;
  border-bottom: 1px solid #f1f5f9 !important;
}
.modern-table-light :deep(tbody tr:hover td) {
  background-color: #f0fdfa !important;
}

/* Table Dark */
.modern-table-dark {
  border-radius: 12px;
  overflow: hidden;
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
  padding: 12px 16px !important;
}
.modern-table-dark :deep(td) {
  color: #f1f5f9 !important;
  padding: 12px 16px !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}
.modern-table-dark :deep(tbody tr:hover td) {
  background-color: rgba(0, 150, 136, 0.12) !important;
}

/* Form Controls in Dark Theme */
.modern-layout-dark :deep(.v-field__input) {
  color: #ffffff !important;
}
.modern-layout-dark :deep(.v-field--variant-filled .v-field__overlay) {
  background-color: rgba(255, 255, 255, 0.06) !important;
}
.modern-layout-dark :deep(.v-label) {
  color: #94a3b8 !important;
}
.modern-layout-dark :deep(.v-messages) {
  color: #94a3b8 !important;
}
</style>
