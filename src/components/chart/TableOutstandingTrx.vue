<template>
  <div>
    <v-toolbar color="transparent" class="mt-n5" rounded-t-xl>
      <v-toolbar-title class="text-cyan text-lg-h5 font-weight-bold">
        Outstanding Transaction
      </v-toolbar-title>
    </v-toolbar>

    <v-divider />

    <v-card rounded="xl" elevation="4" class="mt-n5">
      <v-data-table-virtual
        :headers="headersOutsandingLocal"
        :loading="loading"
        :items="outstandingTransaction"
        class="modern-table text-black mt-n2"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="me-2" size="small" @click="editOutsTrx(item)">
            mdi-pencil-outline
          </v-icon>
        </template>
        <template #[`item.total`]="{ item }">
          {{ formatPrice(item.total) }}
        </template>
      </v-data-table-virtual>
    </v-card>

    <!-- DIALOG -->
    <v-dialog
      v-model="DialogUpdateDescription"
      max-width="400"
      persistent
      transition="dialog-top-transition"
    >
      <v-card class="elevation-12" rounded="xl" style="opacity: 0.9;">
        <v-card-title class="text-h5 font-weight-regular bg-cyan-darken-2">
          <v-icon size="30">mdi-unity</v-icon>&nbsp; Change Status
        </v-card-title>

        <v-card-text>
          <v-textarea
            label="Description"
            v-model="transactionUpdateDescription.description"
            class="pa-1 ma-1"
            row-height="20"
            rows="2"
            variant="outlined"
            auto-grow
            @keyup.enter="updateDescriptionTranaction"
          />
        </v-card-text>

        <v-card-actions class="pa-2 text-end">
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
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useTransaction } from "@/composables/useTransaction";
import { Transaction } from "@/types";
import { useGlobal } from "@/composables/useGlobal";

  /* -----------------------------------------------------*
   * COMPOSABLES                                          *
   * ---------------------------------------------------- */
const{
  formatPrice,
  //helpers
  handleError,
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
    handleError(e);
  }
};

const onFetchOutstandingTransaction = async() => {
  try {
    await fetchOustandingTransaction();
  } catch (e) {
    handleError(e);
  }
};

</script>

<style scoped>
/* --- SAME CSS --- */
.modern-table {
  border-radius: 12px;
  overflow: hidden;
}
.modern-table .v-data-table-header {
  background-color: #f5f5f5;
  color: #333;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.modern-table .v-data-table__tr:hover {
  background-color: #e0f7fa !important;
}
.modern-table .v-data-table-header th,
.modern-table .v-data-table__td {
  padding: 12px 16px;
}
.modern-table .v-data-table__tr {
  border-bottom: 1px solid #eee;
}
.modern-table .v-data-table__tr:last-child {
  border-bottom: none;
}
</style>
