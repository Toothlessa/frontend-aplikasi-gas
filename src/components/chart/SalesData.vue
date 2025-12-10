<template>
  <v-toolbar color="transparent" class="mt-n5" rounded-t-xl>
    <v-toolbar-title class="text-teal text-lg-h5 font-weight-bold">
      Gas Sales data
    </v-toolbar-title>
  </v-toolbar>

  <v-divider></v-divider>

  <v-card rounded="xl" elevation="4" class="mt-n5">
    <Line
      :data="data"
      :options="options"
      width="100px"
      height="200px"
      :css-classes="cssClasses"
      :styles="styles"
      :plugins="plugins"
    />
  </v-card>
</template>

<script setup lang="ts">
/* -------------------------------
   IMPORT CHART.JS & VUE-CHARTJS
--------------------------------*/
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/* -------------------------------
   IMPORT TRANSACTION LOGIC
--------------------------------*/
import { onMounted, ref, watch } from "vue";
import { useTransaction } from "@/composables/useTransaction";
import { useLineChart } from "@/composables/chart/useLineChart";

/* composable */
const { last30DaysTransaction, fetchLast30DaysSale } = useTransaction();
const {
  data,
  options,
  cssClasses,
  styles,
  plugins,
} = useLineChart();

/* -------------------------------
   FETCH API ON LOAD
--------------------------------*/
onMounted(() => {
  fetchLast30DaysSale();
});

/* -------------------------------
   WATCH TRANSACTION DATA
--------------------------------*/
watch(
  last30DaysTransaction,
  (val) => {
    if (!Array.isArray(val) || val.length === 0) {
      data.value = { labels: [], datasets: [] };
      return;
    }

    const labels = val.map((d) => d.day);
    const totals = val.map((d) => Number(d.total));
    const monthLabel = val[0]?.month || "Sales";

    data.value = {
      labels,
      datasets: [
        {
          label: monthLabel,
          backgroundColor: "#2EBFAF",
          data: totals,
        },
      ],
    };
  },
  { immediate: true }
);
</script>
