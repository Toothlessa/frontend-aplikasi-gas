<template>
  <div>
    <v-toolbar color="transparent" density="compact" class="px-0">
      <v-toolbar-title :class="isDark ? 'text-amber-lighten-3 text-h6 font-weight-bold' : 'text-amber-darken-1 text-h6 font-weight-bold'">
        <v-icon start size="22" :color="isDark ? 'amber-lighten-3' : 'amber-darken-1'">mdi-cash-remove</v-icon>
        Outstanding Debt
      </v-toolbar-title>
    </v-toolbar>

    <v-divider class="my-2" :style="isDark ? 'border-color: rgba(255,255,255,0.08);' : ''" />

    <div class="table-wrapper mt-3">
      <v-data-table-virtual
        :headers="headerOutstandingDebt"
        :items="outstandingDebtData"
        :loading="loadingData"
        :class="isDark ? 'modern-table-dark' : 'modern-table-light'"
      > 
        <template #[`item.total_debt`]="{ item }">
          {{ formatPrice(item.total_debt) }}
        </template>
        <template #[`item.total_pay`]="{ item }">
          {{ formatPrice(item.total_pay) }}
        </template>
        <template #[`item.debt_left`]="{ item }">
          <span class="text-error font-weight-bold">{{ formatPrice(item.debt_left) }}</span>
        </template>
      </v-data-table-virtual>
    </div>

    <!-- Snackbars -->
    <SnackbarError :messages="validationErrorMessages" v-model="validationShowError" :timeout="2000" />
    <!-- <SnackbarSuccess v-model="hasSaved" message="Action completed successfully!" :timeout="2000" /> -->

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useDebt } from '@/composables/useDebt';
import { useGlobal } from '@/composables/useGlobal';
import { useTheme } from 'vuetify/lib/framework.mjs';
import { 
          SnackbarError, 
          //SnackbarSuccess 
        } from '@/components/globalComponent';

  /* -----------------------------------------------------*
   * COMPOSABLES                                          *
   * ---------------------------------------------------- */
const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const {
  formatPrice,
  validationError,
  validationErrorMessages,
  validationShowError
} = useGlobal();

const {
  //hasSaved,
  
  outstandingDebtData,
  loadingData,
  headerOutstandingDebt,

  fetchOutstandingDebt
} = useDebt();

  /* -----------------------------------------------------*
   * ON MOUNTED                                           *
   * ---------------------------------------------------- */
onMounted(() => {
  onFetchOutstandingDebt();
});

  /* -----------------------------------------------------*
   * FUNCTIONS                                            *
   * ---------------------------------------------------- */
const onFetchOutstandingDebt = async () => {
  try {
    fetchOutstandingDebt();
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
  background-color: rgba(46, 191, 175, 0.12) !important;
}
</style>