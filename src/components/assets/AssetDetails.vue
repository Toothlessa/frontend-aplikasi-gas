<template>
  <v-container class="modern-container">
    <v-card class="modern-card" rounded="xl" elevation="8" :class="isDark ? 'modern-card-dark' : 'modern-card-light'">
      <v-card-title class="modern-header" :class="isDark ? 'modern-header-dark' : 'modern-header-light'">
        <v-icon start size="32">mdi-information-outline</v-icon>
        <span class="text-h5 font-weight-bold">Asset Details</span>
      </v-card-title>
      <v-divider class="my-4" :style="isDark ? 'border-color: rgba(255,255,255,0.08);' : ''" :color="isDark ? undefined : 'teal-lighten-3'" />

      <!-- LOADING -->
      <template v-if="loading">
        <v-card class="rounded-xl pa-4" :class="isDark ? 'modern-card-dark' : 'modern-card-light'">
          <v-skeleton-loader type="heading, text" />
        </v-card>
      </template>

      <template v-else>
        <v-card-text>
          <v-data-table-virtual
            :headers="headerAssetDetail"
            :items="assetDetails"
            :loading="loading"
            :class="isDark ? 'modern-table-dark' : 'modern-table-light'"
            item-value="id"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                icon="mdi-pencil"
                size="small"
                variant="text"
                :color="isDark ? 'teal-accent-3' : 'blue-grey'"
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
      <v-card rounded="xl" :class="isDark ? 'dialog-card-dark' : 'dialog-card-light'">
        <v-card-title class="dialog-header text-white" :class="isDark ? 'bg-teal-darken-2' : 'bg-teal'">
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

    <!-- Snackbar -->
    <SnackbarError v-model="validationShowError" :messages="validationErrorMessages" :timeout="2000" />
    <SnackbarSuccess v-model="hasSaved" message= "Action completed successfully!" :timeout="2000" />

  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { Asset } from '@/types/Asset';
import { useAsset } from '@/composables/useAsset';
import { useGlobal } from '@/composables/useGlobal';
import { useMasterItem } from '@/composables/useMasterItem';
import { useRoute } from 'vue-router';
import { SnackbarError, SnackbarSuccess } from '@/components/globalComponent';

  /* -----------------------------------------------------*
   * COMPOSABLES                                          *
   * ---------------------------------------------------- */
const {
  theme,
  formatPrice,
  //validation helpers
  validationErrorMessages,
  validationShowError,
  validationError,
} = useGlobal();

const isDark = computed(() => theme.global.current.value.dark);

const {
  mItems,

  loadMasterItem,
} = useMasterItem();

const {
  headerAssetDetail,
  
  loading,
  loadingButtonCreate,
  assetToUpdate,

  //vuex
  createAsset,
  loadAssetDetail,
  loadOwners,

  isNavigatingBack,
  goBack,
  hasSaved,
  assetOwners,
  assetDetails,
  resetAssetDetail,
} = useAsset();


  /* -----------------------------------------------------*
   * LIFECYCLE HOOKS                                      *
   * ---------------------------------------------------- */

onMounted(() => {
  onLoadAssetDetail();
  onLoadOwners();
  onLoadMasterItem();
});

  /* -----------------------------------------------------*
   * CONSTANT                                             *
   * ---------------------------------------------------- */

const route = useRoute();
const dialogUpdateAssetDetail = ref(false);
const owner_id = Number(route.params.owner_id);
const item_id  = Number(route.params.item_id);

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
    
  } catch (e) {
    validationError(e);
  } 
};

const onLoadAssetDetail = async () => {
  resetAssetDetail();
  try {
    await loadAssetDetail(owner_id, item_id);
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
.modern-container {
  padding: 24px;
}

.modern-card-light {
  background-color: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
}

.modern-card-dark {
  background-color: #1e1e24 !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
}

.modern-header-light {
  background: linear-gradient(135deg, #009688 0%, #26A69A 100%);
  color: white;
  padding: 20px 24px;
  text-align: center;
  justify-content: center;
}

.modern-header-dark {
  background: linear-gradient(135deg, #00695C 0%, #00897B 100%);
  color: white;
  padding: 20px 24px;
  text-align: center;
  justify-content: center;
}

/* Table Light */
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
  border-bottom: 1px solid #f1f5f9 !important;
}

/* Table Dark */
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}
.modern-table-dark :deep(tbody tr:hover td) {
  background-color: rgba(0, 150, 136, 0.12) !important;
}

/* Dialog Dark & Light */
.dialog-card-dark {
  background-color: #1e1e24 !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}
.dialog-card-light {
  background-color: #ffffff !important;
}
.dialog-card-dark :deep(.v-field__input) {
  color: #ffffff !important;
}
.dialog-card-dark :deep(.v-field--variant-filled .v-field__overlay) {
  background-color: rgba(255, 255, 255, 0.06) !important;
}
.dialog-card-dark :deep(.v-label) {
  color: #94a3b8 !important;
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