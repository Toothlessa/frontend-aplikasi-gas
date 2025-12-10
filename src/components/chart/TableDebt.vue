<template>
    <div>
      <v-toolbar color="transparent" class="mt-n5" rounded-t-xl>
        <v-toolbar-title class=" text-teal text-lg-h5 font-weight-bold">Outstanding Debt</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card rounded="xl" elevation="4" class="mt-n5">
        <v-data-table-virtual
          :headers="localHeaderSummaryDebt"
          :items="outstandingDebtData"
          :loading="loadingData"
          class="modern-table text-black mt-n2"
        > 
        </v-data-table-virtual>
      </v-card>
    </div>
  </template>
  
<script setup lang="ts">
import { useDebt } from '@/composables/useDebt';
import { onMounted } from 'vue';


const {
  outstandingDebtData,
  loadingData,
  localHeaderSummaryDebt,

  fetchOutstandingDebt
} = useDebt();

onMounted(() => {
  fetchOutstandingDebt();
});

</script>
  
  <style scoped>
.modern-table {
  border-radius: 12px; /* Inherit from card, but good to be explicit */
  overflow: hidden; /* Ensures rounded corners are applied to content */
}

.modern-table .v-data-table-header {
  background-color: #f5f5f5; /* Light grey header */
  color: #333;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modern-table .v-data-table__tr:hover {
  background-color: #e0f7fa !important; /* Light cyan on hover */
}

/* General table cell padding */
.modern-table .v-data-table-header th,
.modern-table .v-data-table__td {
  padding: 12px 16px;
}

/* Make the table rows slightly rounded if possible, though v-data-table-virtual might not fully support this directly on rows */
.modern-table .v-data-table__tr {
  border-bottom: 1px solid #eee; /* Subtle row divider */
}

.modern-table .v-data-table__tr:last-child {
  border-bottom: none; /* No border on the last row */
}
  </style>