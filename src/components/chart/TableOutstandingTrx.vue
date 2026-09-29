<template>
  <div>
    <v-toolbar color="transparent" density="compact" class="px-0">
      <v-toolbar-title :class="isDark ? 'text-cyan-accent-3 text-h6 font-weight-bold' : 'text-cyan-darken-2 text-h6 font-weight-bold'">
        <v-icon start size="22" :color="isDark ? 'cyan-accent-3' : 'cyan-darken-2'">mdi-clock-alert-outline</v-icon>
        Outstanding Transactions
      </v-toolbar-title>
    </v-toolbar>

    <v-divider class="my-2" :style="isDark ? 'border-color: rgba(255,255,255,0.08);' : ''" />

    <div class="table-wrapper mt-3">
      <v-data-table-virtual
        :headers="headersOutsandingLocal"
        :loading="loading"
        :items="outstandingTransaction"
        :class="isDark ? 'modern-table-dark' : 'modern-table-light'"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="me-2 action-icon" size="small" @click="editOutsTrx(item)">
            mdi-pencil-outline
          </v-icon>
        </template>
        <template #[`item.total`]="{ item }">
          <span class="font-weight-medium">{{ formatPrice(item.total) }}</span>
        </template>
      </v-data-table-virtual>
    </div>

    <!-- DIALOG -->
    <v-dialog
      v-model="DialogUpdateDescription"
      max-width="400"
      persistent
      transition="dialog-top-transition"
    >
      <v-card class="elevation-12" rounded="xl">
        <v-card-title class="text-h6 font-weight-bold bg-cyan-darken-2 text-white py-3 px-4">
          <v-icon size="24" start>mdi-pencil-box-outline</v-icon> Change Status
        </v-card-title>

        <v-card-text class="pt-4">
          <v-textarea
            label="Description"
            v-model="transactionUpdateDescription.description"
            row-height="20"
            rows="2"
            variant="outlined"
            auto-grow
            @keyup.enter="updateDescriptionTranaction"
          />
        </v-card-text>

        <v-card-actions class="pa-4 pt-0 text-end">
          <v-spacer />

          <v-btn
            class="text-none"
            color="medium-emphasis"
            variant="outlined"
            rounded
            min-width="92"
            @click="DialogUpdateDescription = false"
          >
            Close
          </v-btn>

          <v-btn
            class="text-none"
            color="cyan-darken-2"
            variant="elevated"
            rounded
            min-width="92"
            :loading="loadingButtonUpdate"
            @click="updateDescriptionTranaction"
          >
            Change
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbars -->
    <SnackbarError :messages="validationErrorMessages" v-model="validationShowError" :timeout="2000" />
    <SnackbarSuccess v-model="hasSaved" message="Action completed successfully!" :timeout="2000" />

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useTransaction } from "@/composables/useTransaction";
import { Transaction } from "@/types";
import { useGlobal } from "@/composables/useGlobal";
import { useTheme } from "vuetify/lib/framework.mjs";
import { 
         SnackbarError, 
         SnackbarSuccess 
        } from '@/components/globalComponent';

  /* -----------------------------------------------------*
   * COMPOSABLES                                          *
   * ---------------------------------------------------- */
const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const{
  formatPrice,
  //helpers
  validationError,
  validationErrorMessages,
  validationShowError,
} = useGlobal();

const{
  //dialog
  DialogUpdateDescription,
  //header
  headersOutsandingLocal,
  //state data
  outstandingTransaction,
  transactionUpdateDescription,
  loading,
  loadingButtonUpdate,
  hasSaved,
  //function
  fetchOustandingTransaction,
  updateDescriptionTransaction,
} = useTransaction();

  /* -----------------------------------------------------*
   * LIFECYCLE                                            *
   * ---------------------------------------------------- */
onMounted(() => {
  onFetchOutstandingTransaction();
});

  /* -----------------------------------------------------*
   * FUNCTIONS                                            *
   * ---------------------------------------------------- */
const editOutsTrx = async(item: Transaction) => {
  Object.assign(transactionUpdateDescription, item);
  DialogUpdateDescription.value = true;
};

const updateDescriptionTranaction = async() => {
  try{
    await updateDescriptionTransaction();
    DialogUpdateDescription.value = false;
    
  }catch(e){
    validationError(e);
  }
};

const onFetchOutstandingTransaction = async() => {
  try {
    await fetchOustandingTransaction();
  } catch (e) {
    validationError(e);
  }
};

</script>

<style scoped>
.table-wrapper {
  border-radius: 12px;
  overflow: hidden;
}

/* Light Mode Table */
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
  background-color: transparent !important;
}
.modern-table-light :deep(tbody tr:hover td) {
  background-color: #f0fdfa !important;
}

/* Dark Mode Table */
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
  background-color: transparent !important;
}
.modern-table-dark :deep(tbody tr:hover td) {
  background-color: rgba(0, 188, 212, 0.12) !important;
}

.action-icon {
  cursor: pointer;
  transition: transform 0.2s, color 0.2s;
}
.action-icon:hover {
  transform: scale(1.15);
  color: #00bcd4;
}
</style>
