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
        Top 10 Customer Transaction
      </v-toolbar-title>
    </v-toolbar>
    <v-divider></v-divider>

    <v-card rounded="xl" elevation="4" class="mt-n5">
      <div class="chart-container">
        <PolarArea :data="data" :options="options" />
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.chart-container {
  width: 350px;
  /* ukuran chart fix */
  height: 350px;
  /* polar charts idealnya square */
  margin: 0 auto;
  /* center */
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(canvas) {
  max-width: 350px;
  max-height: 350px;
}
</style>
