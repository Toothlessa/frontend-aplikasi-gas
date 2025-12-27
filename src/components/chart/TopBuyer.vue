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
        <PolarArea :data="data" :options="defaultPolarOptions" />
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { PolarArea } from "vue-chartjs";
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);
import { onMounted, computed } from "vue";
import { useCustomer } from "@/composables/useCustomer";
import { usePolarChart } from "@/composables/chart/usePolarChart";
import { useGlobal } from "@/composables/useGlobal";

 /* ------------------------------------------------------*
   * COMPOSABLES                                            *
   * ---------------------------------------------------- */
const { handleError } = useGlobal();
const { labels, totals, loadTopCustomerTransaction } = useCustomer();
const { defaultPolarOptions, createPolarChartData, } = usePolarChart();

 /* ------------------------------------------------------*
   * LIFECYCLE                                            *
   * ---------------------------------------------------- */
onMounted(() => {
  onloadTopCustomerTransaction();
});

 /* ------------------------------------------------------*
   * FUNCTIONS                                            *
   * ---------------------------------------------------- */

const data = computed(() =>
  createPolarChartData(labels.value, totals.value)
);

const onloadTopCustomerTransaction = async () => {
  try{
    await loadTopCustomerTransaction();
  }catch(e){
    handleError(e);
  }
};

</script>

<style scoped>
.chart-container {
  width: 350px;
  height: 350px;
  margin: 0 auto;
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
