<script setup lang="ts">
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { PolarArea } from 'vue-chartjs'
import { createPolarChartData } from '@/chart/PolarChart'
import { useCustomer } from '@/composables/useCustomer'
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend)

const store = useStore()
const { 
  labels, 
  totals,
  loadTopCustomerTransaction,

 } = useCustomer()

// Load data from vuex when component mounted
onMounted(() => {
  loadTopCustomerTransaction();
})

const data = computed(() => 
  createPolarChartData(labels.value, totals.value)
)

const options = {
  responsive: true,
}
</script>

<template>
  <div>
    <v-toolbar color="transparent" class="mt-n5" rounded-t-xl>
      <v-toolbar-title class="text-deep-orange text-lg-h5 font-weight-bold">
        Top 5 Buyer
      </v-toolbar-title>
    </v-toolbar>
    <v-divider></v-divider>

    <v-card rounded="xl" elevation="4" class="mt-n5">
      <PolarArea
        :data="data"
        :options="options"
      />
    </v-card>
  </div>
</template>
